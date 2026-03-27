import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RawRow {
  [key: string]: unknown;
}

// Clean and validate data rows
function cleanData(rows: RawRow[]): { cleaned: RawRow[]; nullRemoved: number; columns: string[] } {
  if (!rows.length) return { cleaned: [], nullRemoved: 0, columns: [] };

  const columns = Object.keys(rows[0]);
  let nullRemoved = 0;

  const cleaned = rows.filter((row) => {
    // Remove rows where ALL values are null/empty
    const hasAllNull = columns.every((col) => {
      const v = row[col];
      return v === null || v === undefined || v === "" || v === "null" || v === "undefined" || v === "NaN";
    });
    if (hasAllNull) { nullRemoved++; return false; }

    // Clean individual cell values
    for (const col of columns) {
      let v = row[col];
      if (v === "null" || v === "undefined" || v === "NaN") { row[col] = null; }
      if (typeof v === "string") { row[col] = (v as string).trim(); }
    }

    // Remove rows where critical fields (ip, country, threat_type) are all missing
    const ip = row["ip"] || row["IP"] || row["ip_address"] || row["source_ip"];
    const country = row["country"] || row["Country"] || row["origin"];
    const threatType = row["threat_type"] || row["threatType"] || row["type"] || row["attack_type"];
    if (!ip && !country && !threatType) { nullRemoved++; return false; }

    return true;
  });

  return { cleaned, nullRemoved, columns };
}

// Map various column names to our schema
function mapToThreatLog(row: RawRow): {
  ip: string; country: string; threat_type: string; severity: string; status: string; description: string;
} {
  const severity = String(row["severity"] || row["Severity"] || row["level"] || "medium").toLowerCase();
  const validSeverity = ["critical", "high", "medium", "low"].includes(severity) ? severity : "medium";
  const status = String(row["status"] || row["Status"] || "active").toLowerCase();
  const validStatus = ["blocked", "mitigated", "active", "investigating"].includes(status) ? status : "active";

  return {
    ip: String(row["ip"] || row["IP"] || row["ip_address"] || row["source_ip"] || "0.0.0.0"),
    country: String(row["country"] || row["Country"] || row["origin"] || "Unknown"),
    threat_type: String(row["threat_type"] || row["threatType"] || row["type"] || row["attack_type"] || "Unknown"),
    severity: validSeverity,
    status: validStatus,
    description: String(row["description"] || row["Description"] || row["details"] || row["message"] || ""),
  };
}

// Parse CSV text into rows
function parseCSV(text: string): RawRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: RawRow = {};
    headers.forEach((h, i) => { row[h] = values[i] || null; });
    return row;
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const contentType = req.headers.get("content-type") || "";
    let rawRows: RawRow[] = [];
    let filename = "upload";
    let fileType = "unknown";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.data && Array.isArray(body.data)) {
        rawRows = body.data;
        filename = body.filename || "data.json";
        fileType = body.fileType || "json";
      } else if (body.csvText) {
        rawRows = parseCSV(body.csvText);
        filename = body.filename || "data.csv";
        fileType = "csv";
      } else {
        return new Response(JSON.stringify({ error: "Provide 'data' array or 'csvText' string" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Unsupported content type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create upload record
    const { data: uploadRecord, error: uploadErr } = await supabase
      .from("static_uploads")
      .insert({ filename, file_type: fileType, row_count: rawRows.length, upload_status: "processing" })
      .select()
      .single();

    if (uploadErr) throw uploadErr;

    // Clean data
    const { cleaned, nullRemoved, columns } = cleanData(rawRows);

    // Map and insert
    const mappedRows = cleaned.map((row) => ({
      ...mapToThreatLog(row),
      source: "upload",
    }));

    if (mappedRows.length > 0) {
      // Insert in batches of 100
      for (let i = 0; i < mappedRows.length; i += 100) {
        const batch = mappedRows.slice(i, i + 100);
        const { error: insertErr } = await supabase.from("threat_logs").insert(batch);
        if (insertErr) throw insertErr;
      }
    }

    // Update upload record
    await supabase
      .from("static_uploads")
      .update({
        cleaned_row_count: cleaned.length,
        null_rows_removed: nullRemoved,
        columns,
        upload_status: "completed",
      })
      .eq("id", uploadRecord.id);

    return new Response(
      JSON.stringify({
        success: true,
        uploadId: uploadRecord.id,
        totalRows: rawRows.length,
        cleanedRows: cleaned.length,
        nullRowsRemoved: nullRemoved,
        columns,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("upload error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Upload failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

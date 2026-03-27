import DataPanel from "@/components/DataPanel";

const DataSourcesPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">Data Sources</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          Upload static data (JSON, CSV) or auto-generate threat intelligence — stored in database
        </p>
      </div>
      <DataPanel />
    </div>
  );
};

export default DataSourcesPage;

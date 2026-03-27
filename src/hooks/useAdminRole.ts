// Simple admin role detection via localStorage
// Admin is set during registration with a special admin code

export function useAdminRole() {
  const stored = localStorage.getItem("cyberUser");
  if (!stored) return { isAdmin: false, role: "user" as const };
  try {
    const user = JSON.parse(stored);
    return {
      isAdmin: user.role === "admin",
      role: (user.role || "user") as "admin" | "user",
    };
  } catch {
    return { isAdmin: false, role: "user" as const };
  }
}

export function setUserRole(role: "admin" | "user") {
  const stored = localStorage.getItem("cyberUser");
  if (!stored) return;
  try {
    const user = JSON.parse(stored);
    user.role = role;
    localStorage.setItem("cyberUser", JSON.stringify(user));
  } catch {}
}

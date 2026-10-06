import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isValidSessionToken } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value ?? "";
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden min-w-0">{children}</main>
    </div>
  );
}
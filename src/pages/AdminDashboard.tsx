import { Outlet } from "react-router-dom";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { AdminLayout } from "@/components/AdminLayout";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar />
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </div>
  );
};

export default AdminDashboard;
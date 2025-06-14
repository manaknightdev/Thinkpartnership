import { Outlet } from "react-router-dom";
import { ClientLayout } from "@/components/ClientLayout";

const ClientDashboard = () => {
  return (
    <ClientLayout>
      <Outlet />
    </ClientLayout>
  );
};

export default ClientDashboard;
import { Outlet } from "react-router-dom";
import { ClientLayout } from "@/components/ClientLayout";
import { BrandingProvider } from "@/contexts/BrandingContext";

const ClientDashboard = () => {
  return (
    <BrandingProvider>
      <ClientLayout>
        <Outlet />
      </ClientLayout>
    </BrandingProvider>
  );
};

export default ClientDashboard;
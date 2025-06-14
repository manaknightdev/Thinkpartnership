import { Outlet } from "react-router-dom";
import { VendorLayout } from "@/components/VendorLayout";

const VendorDashboard = () => {
  return (
    <VendorLayout>
      <Outlet />
    </VendorLayout>
  );
};

export default VendorDashboard;
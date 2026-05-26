import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import "../layout/est_layout.css"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <>
      {/* Sidebar */}
      

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import TopNavBar from "./TopNavbar.jsx";
import FAQ from "../common/FAQ.jsx";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="min-h-screen lg:ml-64">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={openSidebar}
          className="fixed left-4 top-4 z-30 rounded-xl bg-white p-2 text-gray-700 shadow-md hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <TopNavBar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <FAQ />
    </div>
  );
};

export default Layout;

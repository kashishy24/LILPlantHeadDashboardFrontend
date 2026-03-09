import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardFilters from "./DashboardFilters";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Here you can trigger global API calls if needed
  };

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dashboard actions */}
        <div className="px-4 sm:px-6 lg:px-8 lg:mt-8">
          <div className="flex flex-col gap-4">
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold lg:hidden mt-4">
              Dashboard
            </h1>
        
            {/* Filters - full width on small, auto on md+ */}
            {/* <div className="w-auto md:w-full">
              <DashboardFilters onFilterChange={handleFilterChange} />
            </div> */}
          </div>
        </div>


        {/* Main content */}
        <main className="grow">
          {children} {/* Page-specific content will go here */}
        </main>
      </div>
    </div>
  );
}

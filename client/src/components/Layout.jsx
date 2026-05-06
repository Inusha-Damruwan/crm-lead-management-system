import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[220px] ml-0 p-5 overflow-y-auto">
        {children}
      </main>

    </div>
  );
};

export default Layout;
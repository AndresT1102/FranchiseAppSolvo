import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Overlay para cerrar el sidebar en móviles */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      
      <div className="main-wrapper">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
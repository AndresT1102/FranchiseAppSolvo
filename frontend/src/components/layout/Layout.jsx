import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <SideBar />
      
      <div className="main-wrapper">
        <Header />
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
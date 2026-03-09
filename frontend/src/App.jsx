import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Franchises from './pages/Franchises';
import Branches from './pages/Branches';
import Products from './pages/Products';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="franchises" element={<Franchises />} />
          <Route path="franchises/:franchiseId/branches" element={<Branches />} />
          <Route path="branches/:branchId/products" element={<Products />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
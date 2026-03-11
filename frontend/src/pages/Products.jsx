import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { productApi, branchApi, franchiseApi } from '../services/api';
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import { showSuccess, showWarning, showConfirm } from '../utils/sweetAlert';
import { handleApiError } from '../utils/errorHandler';
import Pagination from '../components/common/Pagination';
import './Pages.css';

const Products = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [franchise, setFranchise] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatingStock, setUpdatingStock] = useState(null);
  const [formData, setFormData] = useState({ name: '', stock: 0, minStock: 0, branchId: '' });
  const [stockValue, setStockValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const branchResponse = await branchApi.getById(branchId);
      const branchData = branchResponse.data;
      setBranch(branchData);
      
      const franchiseResponse = await franchiseApi.getById(branchData.franchiseId);
      setFranchise(franchiseResponse.data);
      
      const productsResponse = await productApi.getAll(branchId);
      setProducts(productsResponse.data);
    } catch (error) {
      handleApiError(error, 'Error loading products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({ name: '', stock: 0, minStock: 0, branchId: parseInt(branchId) });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      stock: product.stock, 
      minStock: product.minStock || 0,
      branchId: product.branchId 
    });
    setShowModal(true);
  };

  const handleUpdateStock = (product) => {
    setUpdatingStock(product);
    setStockValue(product.stock);
    setShowStockModal(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Are you sure?',
      'Do you want to delete this product?'
    );

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        await productApi.delete(id);
        await loadData();
        showSuccess('Product deleted successfully!');
      } catch (error) {
        handleApiError(error, 'Failed to delete product');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showWarning('Please enter a product name');
      return;
    }

    if (formData.stock < 0) {
      showWarning('Stock cannot be negative');
      return;
    }

    if (formData.minStock < 0) {
      showWarning('Minimum stock cannot be negative');
      return;
    }

    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, { 
          name: formData.name, 
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock)
        });
        showSuccess('Product updated successfully!');
      } else {
        await productApi.create({
          ...formData,
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock)
        });
        showSuccess('Product created successfully!');
      }
      
      setShowModal(false);
      setFormData({ name: '', stock: 0, minStock: 0, branchId: '' });
      await loadData();
    } catch (error) {
      handleApiError(error, 'Error saving product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    
    if (stockValue < 0) {
      showWarning('Stock cannot be negative');
      return;
    }
    setUpdatingStockId(updatingStock.id);
    try {
      await productApi.updateStock(updatingStock.id, parseInt(stockValue));
      
      // Check if stock is below minimum after update
      if (parseInt(stockValue) <= updatingStock.minStock && updatingStock.minStock > 0) {
        showWarning(`Warning: ${updatingStock.name} is now below minimum stock level!`);
      } else {
        showSuccess('Stock updated successfully!');
      }
      
      setShowStockModal(false);
      setUpdatingStock(null);
      await loadData();
    } catch (error) {
      handleApiError(error, 'Error updating stock. Please try again.');
    } finally {
      setUpdatingStockId(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stock <= p.minStock && p.minStock > 0).length;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">{branch?.name} - Products</h2>
          <p className="page-subtitle">
            {franchise?.name} / {branch?.name}
            {lowStockCount > 0 && (
              <span className="low-stock-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                {lowStockCount} product{lowStockCount > 1 ? 's' : ''} with low stock
              </span>
            )}
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleCreate}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          }
        >
          Create Product
        </Button>
      </div>

      <div className="page-content">
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
        />

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock</th>
                <th>Min. Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const isLowStock = product.stock <= product.minStock && product.minStock > 0;
                  return (
                    <tr key={product.id} className={isLowStock ? 'low-stock-row' : ''}>
                      <td className="font-semibold">
                        {product.name}
                        {isLowStock && (
                          <span className="low-stock-icon" title="Low stock alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`stock-badge ${isLowStock ? 'stock-badge-low' : ''}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <span className="min-stock-badge">
                          {product.minStock > 0 ? `${product.minStock} units` : 'Not set'}
                        </span>
                      </td>
                      <td>
                        {isLowStock ? (
                          <span className="status-badge status-warning">
                            ⚠️ Low Stock
                          </span>
                        ) : (
                          <span className="status-badge status-ok">
                            ✓ OK
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn action-btn-stock"
                            onClick={() => handleUpdateStock(product)}
                            disabled={deletingId === product.id || updatingStockId === product.id}
                            title="Update Stock"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                            Update Stock
                          </button>
                          <button
                            className="action-btn action-btn-edit"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {searchTerm ? 'No products found matching your search.' : 'No products yet. Create your first product!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit} loading={submitting}>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">Stock <span className="required">*</span></label>
            <input
              type="number"
              id="stock"
              className="form-input"
              placeholder="Enter stock quantity"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="minStock">
              Minimum Stock Level
              <span className="field-hint"> (Optional - Set to 0 to disable alerts)</span>
            </label>
            <input
              type="number"
              id="minStock"
              className="form-input"
              placeholder="Enter minimum stock level"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              min="0"
            />
            <small className="form-help-text">
              You'll receive an alert when stock falls to or below this level
            </small>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Update Stock"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowStockModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={handleStockSubmit}>
              Update Stock
            </Button>
          </>
        }
      >
        <form onSubmit={handleStockSubmit}>
          <p className="stock-product-name">{updatingStock?.name}</p>
          {updatingStock?.minStock > 0 && (
            <p className="stock-info">
              Minimum stock level: <strong>{updatingStock.minStock} units</strong>
            </p>
          )}
          <div className="form-group">
            <label htmlFor="stockValue">New Stock Quantity <span className="required">*</span></label>
            <input
              type="number"
              id="stockValue"
              className="form-input"
              placeholder="Enter new stock quantity"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              min="0"
              required
            />
            {updatingStock?.minStock > 0 && stockValue <= updatingStock.minStock && (
              <div className="stock-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Warning: Stock will be below minimum level!
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
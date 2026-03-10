import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { franchiseApi, branchApi } from '../services/api';
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import { showSuccess, showConfirm, showWarning } from '../utils/sweetAlert';
import { handleApiError } from '../utils/errorHandler';
import Pagination from '../components/common/Pagination';
import './Franchises.css';

const Franchises = () => {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState([]);
  const [branchCounts, setBranchCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadFranchises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await franchiseApi.getAll();
      const franchisesData = response.data;
      setFranchises(franchisesData);
      
      const counts = {};
      await Promise.all(
        franchisesData.map(async (franchise) => {
          try {
            const branchesResponse = await branchApi.getAll(franchise.id);
            counts[franchise.id] = branchesResponse.data.length;
          } catch {
            counts[franchise.id] = 0;
          }
        })
      );
      setBranchCounts(counts);
    } catch (error) {
      handleApiError(error, 'Failed to load franchises');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFranchises();
  }, [loadFranchises]);

  const handleCreate = () => {
    setEditingFranchise(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  const handleEdit = (franchise) => {
    setEditingFranchise(franchise);
    setFormData({ name: franchise.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Are you sure?',
      'Do you want to delete this franchise?'
    );

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        await franchiseApi.delete(id);
        await loadFranchises();
        showSuccess('Franchise deleted successfully!');
      } catch (error) {
        handleApiError(error, 'Failed to delete franchise.');
      } finally {
        setDeletingId(null); 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showWarning('Please enter a franchise name');
      return;
    }

    setSubmitting(true);
    try {
      if (editingFranchise) {
        await franchiseApi.update(editingFranchise.id, formData);
        showSuccess('Franchise updated successfully!');
      } else {
        await franchiseApi.create(formData);
        showSuccess('Franchise created successfully!');
      }
      
      setShowModal(false);
      setFormData({ name: '' });
      await loadFranchises();
    } catch (error) {
      handleApiError(error, 'Failed to save franchise.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFranchises = franchises.filter(franchise =>
    franchise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFranchises.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFranchises = filteredFranchises.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading">Loading franchises...</div>;
  }

  return (
    <div className="franchises-page">
      <div className="page-header">
        <h2 className="page-title">Franchises</h2>
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
          Create Franchise
        </Button>
      </div>

      <div className="page-content">
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search franchises..."
        />

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Franchise Name</th>
                <th>Branches</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFranchises.length > 0 ? (
                currentFranchises.map((franchise) => (
                  <tr key={franchise.id}>
                    <td className="font-semibold">{franchise.name}</td>
                    <td>{branchCounts[franchise.id] || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn-view"
                          onClick={() => navigate(`/franchises/${franchise.id}/branches`)}
                          title="View Branches"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Branches
                        </button>
                        <button
                          className="action-btn action-btn-edit"
                          onClick={() => handleEdit(franchise)}
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button
                          className="action-btn action-btn-delete"
                          onClick={() => handleDelete(franchise.id)}
                          disabled={deletingId === franchise.id}
                          title="Delete"
                        >
                          {deletingId === franchise.id ? (  // ⬅️ NUEVO
                        <span className="btn-spinner"></span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">
                    {searchTerm ? 'No franchises found matching your search.' : 'No franchises yet. Create your first franchise!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredFranchises.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingFranchise ? 'Edit Franchise' : 'Create New Franchise'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit} loading={submitting}>
              {editingFranchise ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Franchise Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter franchise name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Franchises;
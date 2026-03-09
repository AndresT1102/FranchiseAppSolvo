import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { franchiseApi, branchApi } from '../services/api';
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

  useEffect(() => {
    loadFranchises();
  }, []);

  const loadFranchises = async () => {
    try {
      setLoading(true);
      const response = await franchiseApi.getAll();
      const franchisesData = response.data;
      setFranchises(franchisesData);
      
      // Load branch counts for each franchise
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
      console.error('Error loading franchises:', error);
      alert('Error loading franchises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    if (!window.confirm('Are you sure you want to delete this franchise?')) {
      return;
    }

    try {
      await franchiseApi.delete(id);
      await loadFranchises();
    } catch (error) {
      console.error('Error deleting franchise:', error);
      alert('Error deleting franchise. It may have associated branches.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a franchise name');
      return;
    }

    try {
      if (editingFranchise) {
        await franchiseApi.update(editingFranchise.id, formData);
      } else {
        await franchiseApi.create(formData);
      }
      
      setShowModal(false);
      setFormData({ name: '' });
      await loadFranchises();
    } catch (error) {
      console.error('Error saving franchise:', error);
      alert('Error saving franchise. Please try again.');
    }
  };

  const filteredFranchises = franchises.filter(franchise =>
    franchise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading franchises...</div>;
  }

  return (
    <div className="franchises-page">
      <div className="page-header">
        <h2 className="page-title">Franchises</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Franchise
        </button>
      </div>

      <div className="page-content">
        {/* Search Bar */}
        <div className="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Franchise Name</th>
                <th>Created Date</th>
                <th>Branches</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFranchises.length > 0 ? (
                filteredFranchises.map((franchise) => (
                  <tr key={franchise.id}>
                    <td className="font-semibold">{franchise.name}</td>
                    <td className="text-gray">-</td>
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
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingFranchise ? 'Edit Franchise' : 'Create New Franchise'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
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
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFranchise ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Franchises;
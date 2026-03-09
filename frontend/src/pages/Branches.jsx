import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { branchApi, franchiseApi, productApi } from '../services/api';

const Branches = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const [franchise, setFranchise] = useState(null);
  const [branches, setBranches] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({ name: '', franchiseId: '' });

  useEffect(() => {
    loadData();
  }, [franchiseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load franchise details
      const franchiseResponse = await franchiseApi.getById(franchiseId);
      setFranchise(franchiseResponse.data);
      
      // Load branches
      const branchesResponse = await branchApi.getAll(franchiseId);
      const branchesData = branchesResponse.data;
      setBranches(branchesData);
      
      // Load product counts for each branch
      const counts = {};
      await Promise.all(
        branchesData.map(async (branch) => {
          try {
            const productsResponse = await productApi.getAll(branch.id);
            counts[branch.id] = productsResponse.data.length;
          } catch {
            counts[branch.id] = 0;
          }
        })
      );
      setProductCounts(counts);
    } catch (error) {
      console.error('Error loading branches:', error);
      alert('Error loading branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBranch(null);
    setFormData({ name: '', franchiseId: parseInt(franchiseId) });
    setShowModal(true);
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({ name: branch.name, franchiseId: branch.franchiseId });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) {
      return;
    }

    try {
      await branchApi.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch. It may have associated products.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a branch name');
      return;
    }

    try {
      if (editingBranch) {
        await branchApi.update(editingBranch.id, { name: formData.name });
      } else {
        await branchApi.create(formData);
      }
      
      setShowModal(false);
      setFormData({ name: '', franchiseId: '' });
      await loadData();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Error saving branch. Please try again.');
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading branches...</div>;
  }

  return (
    <div className="branches-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">{franchise?.name} - Branches</h2>
          <p className="page-subtitle">Manage branches for this franchise</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Branch
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
                <th>Branch Name</th>
                <th>Created Date</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => (
                  <tr key={branch.id}>
                    <td className="font-semibold">{branch.name}</td>
                    <td className="text-gray">-</td>
                    <td>{productCounts[branch.id] || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn-view"
                          onClick={() => navigate(`/branches/${branch.id}/products`)}
                          title="View Products"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Products
                        </button>
                        <button
                          className="action-btn action-btn-edit"
                          onClick={() => handleEdit(branch)}
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button
                          className="action-btn action-btn-delete"
                          onClick={() => handleDelete(branch.id)}
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
                    {searchTerm ? 'No branches found matching your search.' : 'No branches yet. Create your first branch!'}
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
                {editingBranch ? 'Edit Branch' : 'Create New Branch'}
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
                  <label htmlFor="name">Branch Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="Enter branch name"
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
                  {editingBranch ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
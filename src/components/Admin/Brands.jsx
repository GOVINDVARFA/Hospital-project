import React, { useEffect, useState } from "react"; //Govind Varfa
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/Slices/brandsSlice";

// ✅ Lucide-react icons
import { Trash2, Search, Settings, Shield, MoreVertical } from "lucide-react";

// ✅ Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Brands = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.brand ?? { data: [], loading: false, error: null }
  );

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await dispatch(updateUser({ id: editId, updatedUser: formData })).unwrap();
        toast.success("Brand updated successfully!");
      } else {
        await dispatch(createUser(formData)).unwrap();
        toast.success("Brand added successfully!");
      }
      resetForm();
      dispatch(fetchData());
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: "" });
    setShowForm(false);
  };

  const handleEditClick = (brand) => {
    setEditId(brand.id);
    setFormData({ name: brand.name || "" });
    setShowForm(true);
  };

  const confirmDeleteBrand = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteUser(confirmDelete)).unwrap();
        toast.success("Brand deleted successfully!");
        dispatch(fetchData());
      } catch {
        toast.error("Delete failed!");
      }
      setConfirmDelete(null);
    }
  };

  const filteredData = Array.isArray(data)
    ? data.filter((brand) =>
        brand.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];


  return (
    <div className=" min-w-full bg-gray-50 min-h-screen relative">
      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 mb-6 rounded-lg p-4">
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={30} color="white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl text-white font-bold">
                Brand Management
              </h1>
              <p className="text-white hidden md:block">Manage system brands</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white jus text-blue-600 h-9 w-40 rounded-md"
          >
            + New Brand
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-1 w-full md:w-80">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="flex justify-center py-2">
          <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
          <span className="ml-2 text-blue-600">Loading...</span>
        </div>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Brand List */}
      <div className="bg-white rounded shadow p-2">
        <div className="text-lg font-semibold border-b pb-2 mb-4">
          Total Brands: {filteredData.length}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
            <div>S.No</div>
            <div>Name</div>
            <div className="text-center">Actions</div>
          </div>

          <div className="flex flex-col py-2 gap-2 mt-2">
            {filteredData.length > 0 ? (
              filteredData.map((brand, index) => (
                <div
                  key={brand.id}
                  className="grid grid-cols-3 gap-4 items-center px-6 py-4 border rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
                >
                  <div>{index + 1}</div>
                  <div className="font-medium">{brand.name}</div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(brand)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Settings size={18} />
                      Update
                    </button>
                    <button
                      onClick={() => setConfirmDelete(brand.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-6">No brands found.</p>
            )}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((brand, index) => (
              <div
                key={brand.id}
                className="border rounded-lg shadow p-4 bg-white"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{brand.name}</p>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === brand.id ? null : brand.id)
                    }
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                {expandedId === brand.id && (
                  <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditClick(brand)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        <Settings size={16} />
                        Update
                      </button>
                      <button
                        onClick={() => setConfirmDelete(brand.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No brands found.</p>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this brand?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBrand}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Update Brand" : "Add Brand"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  fetchDoctors,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/Slices/CommissionSettingsSlice";
import { Search, Shield, Trash2, PlusCircle, Settings, Edit, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CommissionSettings() {
  const dispatch = useDispatch();
  const { data: commissions = [], loading = false, doctors = {} } =
    useSelector((state) => state.commission_settings ?? {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // commission being edited
  const [form, setForm] = useState({
    doctor_id: "",
    type: "",
    source: "",
    value: "",
    calculation_type: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (!showForm) {
      setForm({ doctor_id: "", type: "", source: "", value: "", calculation_type: "" });
      setEditing(null);
      setError("");
    }
  }, [showForm]);

  const filtered = commissions
    .filter((c) => {
      const doctorName = doctors?.[c.doctor_id]?.name || "";
      const searchable = `${c.doctor_id} ${doctorName} ${c.type} ${c.source}`.toLowerCase();
      return searchable.includes(searchTerm.toLowerCase());
    })
    .reverse();

  // submit add or update
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");

    if (!form.doctor_id) {
      setError("Please select a doctor");
      return;
    }

    try {
      if (editing) {
        await dispatch(updateUser({ id: editing.id, updatedUser: form })).unwrap();
        toast.success("Commission updated successfully");
      } else {
        await dispatch(createUser(form)).unwrap();
        toast.success("Commission added successfully");
      }
      dispatch(fetchData());
      setShowForm(false);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      doctor_id: c.doctor_id || "",
      type: c.type || "",
      source: c.source || "",
      value: c.value || "",
      calculation_type: c.calculation_type || "",
    });
    setShowForm(true);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteUser(deleteId)).unwrap();
      toast.success("Commission deleted");
      dispatch(fetchData());
    } catch {
      toast.error("Delete failed");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-0  bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg md:text-2xl leading-5 font-bold">Commission Settings</h2>
              <p className="leading-4 hidden md:block opacity-80">Manage doctor commissions</p>
            </div>
          </div>

          {/* New Commission Button - Responsive */}
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
              setForm({ doctor_id: "", type: "", source: "", value: "", calculation_type: "" });
            }}
            className="flex text-xs md:text-sm items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100  sm:w-auto  whitespace-nowrap"
          >
            <PlusCircle size={15} /> New Commission
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 gap-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-sm md:text-base">
              <th className="p-3">S.No</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Type</th>
              <th className="p-3">Source</th>
              <th className="p-3">Value</th>
              <th className="p-3">Calculation</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No commissions found
                </td>
              </tr>
            ) : (
              filtered.map((commission, idx) => (
                <tr
                  key={commission.id}
                  className="border-b hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{doctors[commission.doctor_id]?.name || `Doctor #${commission.doctor_id}`}</td>
                  <td className="p-3">{commission.type}</td>
                  <td className="p-3">{commission.source}</td>
                  <td className="p-3">{commission.value}</td>
                  <td className="p-3">{commission.calculation_type}</td>
                  <td className="p-3 flex justify-center gap-2 items-center">
                    <button
                      onClick={() => handleEdit(commission)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => confirmDelete(commission.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No commissions found.</p>
        ) : (
          filtered.map((commission) => (
            <div
              key={commission.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{doctors[commission.doctor_id]?.name || `Doctor #${commission.doctor_id}`}</p>
                  <p className="text-gray-600 text-sm">{commission.value}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === commission.id ? null : commission.id)}
                  className={`transform transition-transform duration-300 ${expandedId === commission.id ? "rotate-180" : "rotate-0"}`}
                >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === commission.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Type:</span> {commission.type}
                  </p>
                  <p>
                    <span className="font-semibold">Source:</span> {commission.source}
                  </p>
                  <p>
                    <span className="font-semibold">Calculation:</span> {commission.calculation_type}
                  </p>

                  <div className="flex gap-2 mt-2 items-center">
                    <button
                      onClick={() => handleEdit(commission)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => confirmDelete(commission.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Commission Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editing ? "Edit Commission" : "Add Commission"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Type"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="Source"
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="Value"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={form.calculation_type}
                onChange={(e) => setForm({ ...form, calculation_type: e.target.value })}
                placeholder="Calculation Type"
                className="border p-2 rounded w-full"
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(""); }}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                >
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="font-semibold text-lg mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this commission?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                onClick={() => doDelete()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommissionSettings;

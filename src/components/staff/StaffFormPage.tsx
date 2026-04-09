import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, BASE_URL } from "../../utils/api";
import { useToast } from "../../hooks/useToast";
import { Staff } from "../../types/staff";
import { Plus } from "lucide-react";

const StaffFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadStaff = useCallback(async () => {
    try {
      const data = await apiFetch(`/staff/${id}`);
      const staff: Staff = data.data || data;
      setName(staff.name || "");
      setPhone(staff.phone || "");
      if (staff.signature_url) {
        setPreviewUrl(staff.signature_url);
      } else if (staff.signature) {
        setPreviewUrl(staff.signature.startsWith("http") ? staff.signature : `${BASE_URL.replace("/api", "")}/${staff.signature}`);
      }
    } catch (err) {
      console.error("Failed to load staff details", err);
      showToast("Failed to load staff details", "danger");
      navigate("/staff");
    } finally {
      setFetching(false);
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    if (isEdit) {
      loadStaff();
    }
  }, [isEdit, loadStaff]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSignatureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name is required", "danger");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (signatureFile) {
        formData.append("signature", signatureFile);
      }
      if (isEdit) {
        // Depending on backend this might need to be POST with a _method=PUT field
        formData.append("_method", "PUT");
      }

      const endpoint = isEdit ? `/staff/${id}` : "/staff";

      await apiFetch(endpoint, {
        method: "POST", // FormData updates in PHP/Laravel usually require POST
        body: formData,
      });

      showToast(`Staff ${isEdit ? "updated" : "created"} successfully`, "success");
      navigate("/staff");
    } catch (err: any) {
      console.error("Save failed:", err);
      showToast(err.message || "Failed to save staff record", "danger");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          {isEdit ? "Edit Staff" : "Add Staff"}
        </h1>
        <button
          onClick={() => navigate("/staff")}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="card p-5 sm:p-6 animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-accent/10 rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-4"
                placeholder="Staff Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-accent/10 rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-4"
                placeholder="+971 50 XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Signature (Image)
              </label>
              <div
                className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${previewUrl ? "border-slate-200 bg-slate-50" : "border-slate-300 hover:border-accent hover:bg-slate-50"
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={previewUrl} alt="Signature Preview" className="h-24 object-contain mb-3" />
                    <span className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded shadow-sm border border-slate-100">Click to change signature</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Plus className="text-slate-400" size={20} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 block mb-1">Upload Signature</span>
                    <span className="text-xs text-slate-400">PNG, JPG up to 2MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/staff")}
              className="px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors order-2 sm:order-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent-hover text-white font-bold px-6 py-3 sm:py-2.5 rounded-xl shadow-md shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {loading ? "Saving..." : "Save Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormPage;

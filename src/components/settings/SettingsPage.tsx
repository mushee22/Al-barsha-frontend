import React, { useState, useEffect } from "react";
import { Save, Upload, Trash2, Camera } from "lucide-react";
import { apiFetch, BASE_URL } from "../../utils/api";
import { Settings } from "../../types";
import { useToast } from "../../hooks/useToast";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    invoice_company_name: "",
    invoice_footer_line1: "",
    invoice_footer_line2: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiFetch("/settings");
      setSettings(response.data);
    } catch (err) {
      showToast("Failed to fetch settings", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify({
          invoice_company_name: settings.invoice_company_name,
          invoice_footer_line1: settings.invoice_footer_line1,
          invoice_footer_line2: settings.invoice_footer_line2,
        }),
      });
      showToast("Settings updated successfully", "success");
    } catch (err) {
      showToast("Failed to update settings", "danger");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadStamp = async () => {
    if (!selectedFile) return;
    setUploadingStamp(true);
    const formData = new FormData();
    formData.append("company_stamp", selectedFile);
    formData.append("remove_company_stamp", "0");
    formData.append("_method", "PUT")

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: formData,
      });
      showToast("Company stamp uploaded", "success");
      setSelectedFile(null);
      fetchSettings(); // Refresh to get new URL
    } catch (err) {
      showToast("Failed to upload stamp", "danger");
    } finally {
      setUploadingStamp(false);
    }
  };

  const removeStamp = async () => {
    if (!window.confirm("Are you sure you want to remove the company stamp?")) return;

    setUploadingStamp(true);
    const formData = new FormData();
    formData.append("remove_company_stamp", "true");


    try {
      await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify({
          remove_company_stamp: true,
        }),
      });
      showToast("Company stamp removed", "success");
      fetchSettings();
    } catch (err) {
      showToast("Failed to remove stamp", "danger");
    } finally {
      setUploadingStamp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-navy">Settings</h1>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-slate-900">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-navy">Invoice Information</h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Maintain the details that appear on your generated invoices.</p>
        </div>
        <form onSubmit={saveGeneralSettings} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              name="invoice_company_name"
              value={settings.invoice_company_name}
              onChange={handleSettingsChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
              placeholder="e.g. AL BARSHA DOCUMENTS TYPING & COPYING"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Invoice Footer Line 1
            </label>
            <textarea
              name="invoice_footer_line1"
              value={settings.invoice_footer_line1}
              onChange={handleSettingsChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm min-h-[80px]"
              placeholder="e.g. Tel: +971 6 5541118, P.O.Box 31864..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Invoice Footer Line 2
            </label>
            <input
              type="text"
              name="invoice_footer_line2"
              value={settings.invoice_footer_line2}
              onChange={handleSettingsChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
              placeholder="e.g. E-mail: albarshatyping333@gmail.com"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 shadow-sm shadow-accent/20"
            >
              {savingSettings ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Company Stamp */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-slate-900">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-navy">Company Stamp</h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Upload a digital version of your company stamp to be included on invoices.</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            {/* Stamp Preview */}
            <div className="w-full md:w-48 h-40 sm:h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden relative group transition-all hover:border-accent/40">
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-full object-contain p-4"
                />
              ) : settings.company_stamp_url ? (
                <>
                  <img
                    src={settings.company_stamp_url}
                    alt="Company Stamp"
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={removeStamp}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove Stamp"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <Camera size={32} className="mb-2 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Stamp</span>
                </div>
              )}
            </div>

            {/* Upload Logic */}
            <div className="flex-1 space-y-4 w-full">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                  Guidelines
                </h3>
                <ul className="text-[10px] sm:text-xs text-blue-800/70 space-y-1 list-disc pl-4">
                  <li>Use a transparent PNG for best results on PDF invoices.</li>
                  <li>Recommended size: 300x300 pixels (Max 5MB).</li>
                  <li>The stamp will appear in the lower-right section of the invoice.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="stamp-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="stamp-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-slate-200 border-dashed rounded-lg hover:border-accent hover:bg-accent/5 cursor-pointer transition-all text-sm font-medium text-slate-600"
                    >
                      <Upload size={16} />
                      <span className="truncate">{selectedFile ? selectedFile.name : "Choose New Image"}</span>
                    </label>
                  </div>
                  {selectedFile && (
                    <button
                      onClick={uploadStamp}
                      disabled={uploadingStamp}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                    >
                      {uploadingStamp ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  )}
                </div>

                {settings.company_stamp_url && !selectedFile && (
                  <label className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-red-300 bg-white checked:bg-red-500 checked:border-red-500 transition-all"
                        onChange={(e) => {
                          if (e.target.checked) {
                            removeStamp();
                          }
                        }}
                      />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                        <Trash2 size={12} />
                      </span>
                    </div>
                    <span className="text-sm font-medium text-red-700 group-hover:text-red-800 transition-colors">
                      Remove current company stamp
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

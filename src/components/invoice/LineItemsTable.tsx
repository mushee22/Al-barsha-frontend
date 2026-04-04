import React from "react";
import { Plus, Trash2, GripVertical, Info } from "lucide-react";
import { LineItem } from "../../types";
import { generateId, fmtAED } from "../../utils";

interface LineItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: LineItem = {
      id: generateId(),
      product_name: "",
      quantity: 1,
      unit_price: "",
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      onChange(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Plus size={14} />
          </div>
          <span className="font-bold text-sm">Descriptions</span>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="w-10"></th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Product / Service Description
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider w-28">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider w-36">
                Unit Price
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider w-36">
                Amount
              </th>
              <th className="w-14"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, index) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="pl-4 text-slate-300">
                  <GripVertical size={14} className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
                <td className="px-2 py-3">
                  <input
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-lg text-sm transition-all placeholder:text-slate-400 font-medium outline-none"
                    placeholder="Describe the product or service…"
                    value={item.product_name}
                    onChange={(e) => updateItem(item.id, "product_name", e.target.value)}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    type="number"
                    className="w-full h-9 px-2 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-lg text-sm text-center font-bold outline-none transition-all"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  />
                </td>
                <td className="px-2 py-3">
                  <div className="relative group/input">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none group-focus-within/input:text-accent transition-colors">
                      AED
                    </span>
                    <input
                      type="number"
                      className="w-full h-9 pl-10 pr-3 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-lg text-right text-sm font-bold outline-none transition-all"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                      step="0.01"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-slate-700">
                    {fmtAED(Number(item.quantity) * Number(item.unit_price))}
                  </span>
                </td>
                <td className="pr-4 py-3">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-slate-100">
        {items.map((item, index) => (
          <div key={item.id} className="p-4 bg-white space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Item #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-xl text-sm transition-all placeholder:text-slate-400 font-medium outline-none resize-none"
                  placeholder="What are you billing for?"
                  value={item.product_name}
                  onChange={(e) => updateItem(item.id, "product_name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-xl text-sm font-bold outline-none transition-all"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">AED</span>
                    <input
                      type="number"
                      className="w-full h-10 pl-10 pr-3 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-xl text-right text-sm font-bold outline-none transition-all"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 px-3 py-2.5 bg-accent/5 rounded-xl border border-accent/10">
                <span className="text-[10px] font-bold text-accent/60 uppercase tracking-wider">Line Total</span>
                <span className="text-sm font-bold text-accent">
                  {fmtAED(Number(item.quantity) * Number(item.unit_price))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Add Row Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-accent hover:text-accent rounded-xl text-xs font-bold text-slate-600 shadow-sm transition-all hover:shadow-md active:scale-95 group w-full sm:w-auto justify-center"
          >
            <div className="w-5 h-5 rounded-lg bg-slate-100 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
              <Plus size={12} className="group-hover:scale-110 transition-transform" />
            </div>
            Add New Row
          </button>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] italic bg-white/50 px-3 py-1.5 rounded-full border border-slate-100">
            <Info size={12} />
            Tip: Use Tab key to navigate through rows quickly
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemsTable;

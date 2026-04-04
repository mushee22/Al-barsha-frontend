import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { Invoice, LineItem } from "../../types";
import { todayISO, generateId } from "../../utils";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import LineItemsTable from "./LineItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import { useNavigate, useParams } from "react-router-dom";

interface InvoiceFormPageProps {
  onToast: (msg: string, type: "success" | "danger") => void;
}

const defaultItems = (): LineItem[] => [
  { id: generateId(), product_name: "", quantity: 1, unit_price: "" },
];

const InvoiceFormPage: React.FC<InvoiceFormPageProps> = ({ onToast }) => {
  const { getInvoice, addInvoice, updateInvoice } = useApp();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [invoice_number, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(todayISO());
  const [customer_name, setCustomerName] = useState("");
  const [staff_id, setStaffId] = useState<number>(0);
  const [items, setItems] = useState<LineItem[]>(defaultItems());
  const [loading, setLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  const loadInvoice = useCallback(async () => {
    if (isEdit && id) {
      setLoading(true);
      const inv = await getInvoice(Number(id));
      if (inv) {
        setInvoiceNumber(inv.invoice_number);
        setDate(inv.date);
        setCustomerName(inv.customer_name);
        setStaffId(inv.staff_id);
        setItems(inv.items.map((i) => ({ ...i })));
      } else {
        onToast("Invoice not found", "danger");
        navigate("/invoices");
      }
      setLoading(false);
    }
  }, [id, isEdit, getInvoice, navigate, onToast]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  const handleFieldChange = (field: string, value: any) => {
    switch (field) {
      case "date": setDate(value); break;
      case "customer_name": setCustomerName(value); break;
      case "staff_id": setStaffId(value); break;
    }
  };

  const handleSave = async () => {
    if (!customer_name.trim()) { onToast("Customer name is required", "danger"); return; }
    if (!date) { onToast("Date is required", "danger"); return; }
    if (!staff_id) { onToast("Please assign a staff member", "danger"); return; }

    const filledItems = items.filter((i) => i.product_name.trim());
    if (filledItems.length === 0) {
      onToast("Add at least one line item with a description", "danger");
      return;
    }

    // Prepare payload with numeric values
    const payload: any = {
      customer_name: customer_name.trim(),
      date,
      staff_id,
      items: filledItems.map(({ id, ...rest }) => ({
        ...rest,
        quantity: Number(rest.quantity) || 0,
        unit_price: Number(rest.unit_price) || 0,
      })),
    };

    const afterSuccess = (data: Invoice) => {
      if (!data.pdf_url) return;
      const anchorTag = document.createElement("a");
      anchorTag.href = data.pdf_url;
      anchorTag.target = "_blank";

      anchorTag.click();
      document.body.removeChild(anchorTag);
    }

    setIsSaving(true);
    try {
      if (isEdit && id) {
        const response = await updateInvoice(Number(id), payload) as any;
        afterSuccess(response.data as Invoice);
        onToast("Invoice updated successfully", "success");
      } else {
        const response = await addInvoice(payload) as any;
        afterSuccess(response.data as Invoice);
        onToast("Invoice created successfully", "success");
      }
      navigate("/invoices");
    } catch (err) {
      onToast("Failed to save invoice", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading invoice details...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start max-w-7xl mx-auto">
      {/* Left — main form */}
      <div className="space-y-5">
        <InvoiceDetailsForm
          invoice_number={invoice_number}
          date={date}
          customer_name={customer_name}
          staff_id={staff_id}
          onChange={handleFieldChange}
        />
        <LineItemsTable items={items} onChange={setItems} />
      </div>

      {/* Right — sticky summary */}
      <div className="lg:sticky lg:top-20">
        <InvoiceSummary
          invoice_number={invoice_number}
          date={date}
          customer_name={customer_name}
          items={items}
          onSave={handleSave}
          onCancel={() => navigate("/invoices")}
          isEdit={isEdit}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default InvoiceFormPage;

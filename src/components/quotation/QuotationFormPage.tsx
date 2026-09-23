import React, { useState, useEffect, useCallback } from "react";
import { useQuotations } from "../../context/QuotationContext";
import { LineItem, Quotation } from "../../types";
import { todayISO, generateId } from "../../utils";
import QuotationDetailsForm from "./QuotationDetailsForm";
import LineItemsTable from "../invoice/LineItemsTable";
import QuotationSummary from "./QuotationSummary";
import { useNavigate, useParams } from "react-router-dom";
import { openOrDownloadPdf } from "../../utils/api";

interface QuotationFormPageProps {
  onToast: (msg: string, type: "success" | "danger") => void;
}

const defaultItems = (): LineItem[] => [
  { id: generateId(), product_name: "", quantity: 1, unit_price: "" },
];

const QuotationFormPage: React.FC<QuotationFormPageProps> = ({ onToast }) => {
  const { getQuotation, addQuotation, updateQuotation } = useQuotations();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [quotation_number, setQuotationNumber] = useState("");
  const [date, setDate] = useState(todayISO());
  const [customer_name, setCustomerName] = useState("");
  const [staff_id, setStaffId] = useState<number>(0);
  const [items, setItems] = useState<LineItem[]>(defaultItems());
  const [loading, setLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  const loadQuotation = useCallback(async () => {
    if (isEdit && id) {
      setLoading(true);
      const quotation = await getQuotation(Number(id));
      if (quotation) {
        setQuotationNumber(quotation.quotation_number);
        setDate(quotation.date);
        setCustomerName(quotation.customer_name);
        setStaffId(quotation.staff_id);
        setItems(
          (quotation.items || []).map((item) => ({
            id: String(item.id),
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          }))
        );
      } else {
        onToast("Quotation not found", "danger");
        navigate("/quotations");
      }
      setLoading(false);
    }
  }, [id, isEdit, getQuotation, navigate, onToast]);

  useEffect(() => {
    loadQuotation();
  }, [loadQuotation]);

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

    const filledItems = items.filter((item) => item.product_name.trim());
    if (filledItems.length === 0) {
      onToast("Add at least one line item with a description", "danger");
      return;
    }

    const invalidItem = filledItems.find((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unit_price);
      return !Number.isInteger(quantity) || quantity < 1 || Number.isNaN(unitPrice) || unitPrice < 0;
    });

    if (invalidItem) {
      onToast("Each item needs a quantity of at least 1 and a unit price of 0 or more", "danger");
      return;
    }

    const payload = {
      customer_name: customer_name.trim(),
      date,
      staff_id,
      items: filledItems.map(({ product_name, quantity, unit_price }) => ({
        product_name: product_name.trim(),
        quantity: Number(quantity),
        unit_price: Number(unit_price),
      })),
    };

    const afterSuccess = async (data: Quotation) => {
      if (!data?.pdf_url && !data?.id) return;
      try {
        await openOrDownloadPdf(data.pdf_url, `/quotations/${data.id}/pdf`, {
          filename: `${data.quotation_number || "quotation"}.pdf`,
        });
      } catch {
        onToast("Please allow popups for this site", "danger");
      }
    };

    setIsSaving(true);
    try {
      if (isEdit && id) {
        const response = await updateQuotation(Number(id), payload);
        await afterSuccess(response.data as Quotation);
        onToast("Quotation updated successfully", "success");
      } else {
        const response = await addQuotation(payload);
        await afterSuccess(response.data as Quotation);
        onToast("Quotation created successfully", "success");
      }
      navigate("/quotations");
    } catch (err) {
      console.log(err);
      onToast("Failed to save quotation", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading quotation details...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start max-w-7xl mx-auto">
      <div className="space-y-5">
        <QuotationDetailsForm
          quotation_number={quotation_number}
          date={date}
          customer_name={customer_name}
          staff_id={staff_id}
          onChange={handleFieldChange}
        />
        <LineItemsTable items={items} onChange={setItems} />
      </div>

      <div className="lg:sticky lg:top-20">
        <QuotationSummary
          quotation_number={quotation_number}
          date={date}
          customer_name={customer_name}
          items={items}
          onSave={handleSave}
          onCancel={() => navigate("/quotations")}
          isEdit={isEdit}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default QuotationFormPage;

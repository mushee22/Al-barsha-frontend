import { LineItem } from "../types";

export const calcTotal = (items: LineItem[]): number =>
  items.reduce((sum, i) => {
    const q = typeof i.quantity === "number" ? i.quantity : parseFloat(i.quantity as string) || 0;
    const p = typeof i.unit_price === "number" ? i.unit_price : parseFloat(i.unit_price as string) || 0;
    return sum + q * p;
  }, 0);

export const fmtAED = (n: number): string =>
  n.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const todayISO = (): string => new Date().toISOString().split("T")[0];

export const padInvoiceNo = (n: number): string =>
  "INV-" + String(n).padStart(4, "0");

export const numberToWords = (n: number): string => {
  if (!n || n === 0) return "Zero Dirhams";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const h = (x: number): string => {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    return ones[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + h(x % 100) : "");
  };
  let d = Math.floor(n), f = Math.round((n - d) * 100), w = "";
  if (d >= 1000) { w += h(Math.floor(d / 1000)) + " Thousand "; d %= 1000; }
  if (d > 0) w += h(d);
  w += " Dirhams";
  if (f > 0) w += " and " + h(f) + " Fils";
  return w.trim();
};

// export const STATUS_STYLES: Record<InvoiceStatus, string> = {
//   paid: "bg-emerald-50 text-emerald-700",
//   pending: "bg-amber-50 text-amber-700",
//   draft: "bg-slate-100 text-slate-500",
// };

// export const STATUS_LABELS: Record<InvoiceStatus, string> = {
//   paid: "Paid",
//   pending: "Pending",
//   draft: "Draft",
// };

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

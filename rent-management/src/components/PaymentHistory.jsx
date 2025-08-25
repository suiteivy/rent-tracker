import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function formatCurrency(amount) {
  if (amount == null) return "-";
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  });
}

const statusStyles = {
  Paid: "bg-green-100 text-green-800 border border-green-300",
  Due: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Overdue: "bg-red-100 text-red-800 border border-red-300",
};

const statusIcons = {
  Paid: <CheckCircle2 className="inline-block mr-1" size={18} />,
  Due: <Clock className="inline-block mr-1" size={18} />,
  Overdue: <XCircle className="inline-block mr-1" size={18} />,
};

function PaymentHistory({
  payments,
  paymentFilter,
  setPaymentFilter,
  sortKey,
  setSortKey,
  sortAsc,
  setSortAsc,
  markAsPaid,
  payingId,
}) {
  const filteredPayments = payments
    .filter((p) => (paymentFilter === "All" ? true : p.status === paymentFilter))
    .sort((a, b) => {
      if (sortKey === "due_date") {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return sortAsc ? dateA - dateB : dateB - dateA;
      }
      if (sortKey === "amount") {
        return sortAsc ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

  return (
    <section className="max-w-5xl w-full bg-white rounded-3xl p-10 shadow-lg border border-gray-100 transition">
      {/* Header */}
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center tracking-tight">
        Payment History
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["All", "Paid", "Due", "Overdue"].map((filter) => (
          <button
            key={filter}
            onClick={() => setPaymentFilter(filter)}
            className={`px-5 py-2 rounded-full font-semibold text-lg transition shadow-sm
              ${
                paymentFilter === filter
                  ? "bg-crimson text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-red-200"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Sorting */}
      <div className="flex justify-center items-center space-x-6 mb-10">
        <label className="font-semibold text-gray-700 text-lg select-none">Sort by:</label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="rounded-lg border border-gray-300 px-5 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-crimson bg-white"
        >
          <option value="due_date">Due Date</option>
          <option value="amount">Amount</option>
        </select>
        <button
          aria-label="Toggle sort order"
          onClick={() => setSortAsc(!sortAsc)}
          title={sortAsc ? "Ascending" : "Descending"}
          className="px-6 py-2 border border-gray-300 rounded-lg font-bold text-lg transition hover:bg-crimson hover:text-white"
        >
          {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <p className="text-center text-gray-500 italic text-xl mt-16">
          No payment records match the filter.
        </p>
      ) : (
        <div className="space-y-6">
          {filteredPayments.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col md:flex-row md:items-center justify-between bg-gray-50 rounded-xl p-5 shadow-sm border
                transition hover:shadow-lg hover:-translate-y-0.5 duration-200 ease-in-out
                ${
                  p.status === "Overdue"
                    ? "border-red-300"
                    : p.status === "Due"
                    ? "border-yellow-300"
                    : "border-green-300"
                }
              `}
            >
              {/* Date & Amount */}
              <div className="flex items-center space-x-6 mb-3 md:mb-0">
                <span className="text-gray-600 font-medium min-w-[100px]">
                  {formatDate(p.due_date)}
                </span>
                <span className="text-crimson font-semibold text-xl">
                  {formatCurrency(p.amount)}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2 mb-3 md:mb-0">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-1 font-semibold text-sm shadow-sm ${statusStyles[p.status]}`}
                >
                  {statusIcons[p.status]}
                  {p.status}
                </span>
              </div>

              {/* Action */}
              <div>
                {!p.is_paid && p.status !== "Overdue" ? (
                  <button
                    onClick={() => markAsPaid(p.id)}
                    disabled={payingId === p.id}
                    className="bg-crimson text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {payingId === p.id ? "Processing..." : "Mark as Paid"}
                  </button>
                ) : (
                  <CheckCircle2
                    className="text-green-600"
                    size={28}
                    title="Paid"
                    aria-label="Paid"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default PaymentHistory;



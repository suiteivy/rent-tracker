import React from "react";
import { Building2 } from "lucide-react";

function Header({ profile, payments }) {
  const totalPayments = payments.length;
  const paidPayments = payments.filter((p) => p.is_paid).length;
  const paymentProgress = totalPayments
    ? (paidPayments / totalPayments) * 100
    : 0;

  return (
    <div className="w-full font-poppins border-b-4 border-gray-300">
      {/* Top Navigation */}
      <nav className="bg-[#ff3f5c] text-white px-12 py-4 shadow-md flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <Building2 className="text-[#ff3f5c]" size={28} />
          </div>
          <span className="text-lg font-bold">Rent Tracker</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-10 text-base font-medium">
          <a href="#" className="bg-red-700 px-5 py-1 rounded-lg">Dashboard</a>
          <a href="#" className="hover:underline">Add Unit</a>
        </div>
      </nav>

      {/* Secondary Header */}
      <div className="bg-gray-50 px-6 py-8 shadow-sm">
        <div className="flex flex-col items-center md:items-start md:flex-row md:space-x-6">
          {/* Icon */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-5 rounded-2xl shadow-lg">
            <Building2 className="text-white" size={48} />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-4xl font-bold text-gray-900">
              Tenant Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {profile?.name ?? "Tenant"} — here’s your property & payment overview.
            </p>
          </div>
        </div>

        {/* Payment Progress Card */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-500 mb-3">
              Rent Payment Completion
            </p>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className="bg-red-500 h-6 rounded-full transition-all duration-[1500ms] ease-in-out"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
            <p className="mt-3 text-gray-700 font-semibold">
              {paidPayments} / {totalPayments} payments made
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
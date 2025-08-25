import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/header";
import PropertiesList from "../components/PropertyList";
import LeaseCalendar from "../components/LeaseCalendar";
import PaymentHistory from "../components/PaymentHistory";
import Loading from "../components/Loading";

function DashboardTenant() {
  const [profile, setProfile] = useState(null);
  const [lease, setLease] = useState(null);
  const [payments, setPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortKey, setSortKey] = useState("due_date");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    getLoggedInUser();
  }, []);

  async function getLoggedInUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting user:", error);
      return;
    }
    if (!user) return;
    setTenantId(user.id);
    fetchData(user.id);
  }

  async function fetchData(id) {
    setLoading(true);

    const { data: profileData } = await supabase.from("tenants").select("*").eq("id", id).single();
    setProfile(profileData);

    const { data: leaseData } = await supabase.from("leases").select("*").eq("tenant_id", id).single();
    setLease(leaseData);

    const { data: paymentsData } = await supabase.from("rent_payments").select("*").eq("tenant_id", id);
    if (paymentsData) {
      const today = new Date();
      const updated = paymentsData.map((p) => {
        const dueDate = new Date(p.due_date);
        let status = "Paid";
        if (!p.is_paid) {
          if (today > dueDate) status = "Overdue";
          else status = "Due";
        }
        return { ...p, status };
      });
      setPayments(updated);
    }

    const { data: propertiesData } = await supabase.from("properties").select("*");
    setProperties(propertiesData || []);

    setLoading(false);
  }

  async function markAsPaid(id) {
    setPayingId(id);
    const { error } = await supabase.from("rent_payments").update({ is_paid: true }).eq("id", id);
    if (error) alert("Failed to update payment. Please try again.");
    else if (tenantId) await fetchData(tenantId);
    setPayingId(null);
  }

  if (loading) return <Loading/>;

  return (
    <div className="font-poppins bg-gray-50 min-h-screen px-6 py-10 flex flex-col items-center">
      <Header profile={profile} payments={payments} />
      <PropertiesList properties={properties} lease={lease} />
      <LeaseCalendar startDate={lease?.start_date} endDate={lease?.end_date} />
      <PaymentHistory
        payments={payments}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        markAsPaid={markAsPaid}
        payingId={payingId}
      />
    </div>
  );
}

export default DashboardTenant;

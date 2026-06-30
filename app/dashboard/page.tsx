"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    delivered: 0,
    pending: 0,
    inTransit: 0,
    warehouses: 0,
    trackingEvents: 0,
  });

  const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const { data: deliveries } = await supabase.from("deliveries").select("*");

    const { data: warehouses } = await supabase.from("warehouses").select("*");

    const { data: trackingHistory } = await supabase
      .from("tracking_history")
      .select("*");

      const { data: recent } = await supabase
        .from("deliveries")
        .select("*")
        .order("id", { ascending: false })
        .limit(5);

    setStats({
      totalDeliveries: deliveries?.length || 0,

      delivered:
        deliveries?.filter((item) => item.status === "Delivered").length || 0,

      pending:
        deliveries?.filter((item) => item.status === "Pending").length || 0,

      inTransit:
        deliveries?.filter((item) => item.status === "In Transit").length || 0,

      warehouses: warehouses?.length || 0,

      trackingEvents: trackingHistory?.length || 0,
    });

    setRecentDeliveries(recent || []);
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Total Deliveries"
              value={stats.totalDeliveries}
              color="blue"
            />

            <Card title="Delivered" value={stats.delivered} color="green" />

            <Card title="Pending" value={stats.pending} color="red" />

            <Card title="In Transit" value={stats.inTransit} color="yellow" />

            <Card title="Warehouses" value={stats.warehouses} color="purple" />

            <Card
              title="Tracking Events"
              value={stats.trackingEvents}
              color="indigo"
            />
          </div>

          <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Shipments</h2>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Tracking</th>
                  <th className="p-3 text-left">Sender</th>
                  <th className="p-3 text-left">Receiver</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b">
                    <td className="p-3">{delivery.tracking_number}</td>

                    <td className="p-3">
                      {delivery.sender_firstname} {delivery.sender_lastname}
                    </td>

                    <td className="p-3">
                      {delivery.receiver_firstname} {delivery.receiver_lastname}
                    </td>

                    <td className="p-3">{delivery.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Wrapper>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`bg-white border-l-4 border-${color}-500 rounded-xl shadow-lg p-6`}
    >
      <h2 className="text-lg text-gray-600">{title}</h2>

      <p className={`text-5xl font-bold text-${color}-600 mt-4`}>{value}</p>
    </div>
  );
}

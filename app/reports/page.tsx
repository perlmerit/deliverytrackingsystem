"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../components/Sidebar";
import Wrapper from "../components/Wrapper";

interface Delivery {
  id: string;
  tracking_number: string;
  customer_name: string;
  destination: string;
  status: string;
}

export default function Reports() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [total, setTotal] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [pending, setPending] = useState(0);
  const [inTransit, setInTransit] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, []);

  async function fetchReportData() {
    const { data, error } = await supabase.from("deliveries").select("*");

    if (error) {
      console.log(error);
      return;
    }

    setDeliveries(data || []);

    setTotal(data.length);

    setDelivered(
      data.filter((delivery) => delivery.status === "Delivered").length,
    );

    setPending(data.filter((delivery) => delivery.status === "Pending").length);

    setInTransit(
      data.filter((delivery) => delivery.status === "In Transit").length,
    );
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        {/* Main Content */}
        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Delivery Reports</h1>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
              <h2 className="text-gray-500 font-medium">Total Deliveries</h2>

              <p className="text-5xl font-bold text-blue-600 mt-2">{total}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600">
              <h2 className="text-gray-500 font-medium">Delivered</h2>

              <p className="text-5xl font-bold text-green-600 mt-2">
                {delivered}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-600">
              <h2 className="text-gray-500 font-medium">Pending</h2>

              <p className="text-5xl font-bold text-red-600 mt-2">{pending}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
              <h2 className="text-gray-500 font-medium">In Transit</h2>

              <p className="text-5xl font-bold text-yellow-500 mt-2">
                {inTransit}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="p-4 text-left">Tracking No</th>

                    <th className="p-4 text-left">Customer</th>

                    <th className="p-4 text-left">Destination</th>

                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{delivery.tracking_number}</td>

                      <td className="p-4">{delivery.customer_name}</td>

                      <td className="p-4">{delivery.destination}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            delivery.status === "Delivered"
                              ? "bg-green-600"
                              : delivery.status === "In Transit"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {deliveries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-8 text-gray-500">
                        No report data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Wrapper>
  );
}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../components/Sidebar";
import Wrapper from "../components/Wrapper";

interface Delivery {
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  origin: string;
  destination: string;
  status: string;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [delivery, setDelivery] = useState<Delivery | null>(null);

  async function handleSearch() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single();

    if (error) {
      alert("Tracking Number Not Found");
      setDelivery(null);
      return;
    }

    setDelivery(data);
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

       
        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8 text-slate-800">
            Track Delivery
          </h1>

         
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border p-4 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition"
            >
              Search
            </button>
          </div>

        
          {delivery && (
            <div className="bg-white p-8 rounded-2xl shadow-lg mt-8 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Delivery Information
              </h2>

              <div className="space-y-4">
                <p>
                  <strong>Tracking Number:</strong> {delivery.tracking_number}
                </p>

                <p>
                  <strong>Customer Name:</strong> {delivery.customer_name}
                </p>

                <p>
                  <strong>Customer Phone:</strong> {delivery.customer_phone}
                </p>

                <p>
                  <strong>Origin:</strong> {delivery.origin}
                </p>

                <p>
                  <strong>Destination:</strong> {delivery.destination}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
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
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </Wrapper>
  );
}

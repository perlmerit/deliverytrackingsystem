"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../components/Sidebar";
import Wrapper from "../components/Wrapper";

interface Delivery {
  tracking_number: string;

  sender_name: string;
  sender_phone: string;

  receiver_name: string;
  receiver_phone: string;

  package_weight: string;
  package_description: string;

  origin: string;
  destination: string;

  bus_number: string;
  departure_time: string;
  expected_arrival: string;
  
  status: string;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [delivery, setDelivery] = useState<Delivery | null>(null);

  const [history, setHistory] = useState<any[]>([]);
async function handleSearch() {
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .single();

  if (error) {
    alert("Tracking Number Not Found");

    setDelivery(null);
    setHistory([]);

    return;
  }

  setDelivery(data);

  const { data: historyData } = await supabase
    .from("tracking_history")
    .select("*")
    .eq("delivery_id", data.id)
    .order("created_at", { ascending: false });

  setHistory(historyData || []);
}

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Track Package</h1>

          {/* Search Box */}

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border p-4 rounded-lg mb-4"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
            >
              Search
            </button>
          </div>

          {/* Results */}

          {delivery && (
            <div className="space-y-6">
              {/* Sender Information */}

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-blue-700 mb-4">
                  Sender Information
                </h2>

                <p>
                  <strong>Name:</strong> {delivery.sender_name}
                </p>

                <p>
                  <strong>Phone:</strong> {delivery.sender_phone}
                </p>
              </div>

              {/* Receiver Information */}

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-green-700 mb-4">
                  Receiver Information
                </h2>

                <p>
                  <strong>Name:</strong> {delivery.receiver_name}
                </p>

                <p>
                  <strong>Phone:</strong> {delivery.receiver_phone}
                </p>
              </div>

              {/* Package Information */}

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-purple-700 mb-4">
                  Package Information
                </h2>

                <p>
                  <strong>Package Weight:</strong> {delivery.package_weight}
                </p>

                <p>
                  <strong>Description:</strong>
                </p>

                <p className="text-gray-700 mt-2">
                  {delivery.package_description}
                </p>
              </div>

              {/* Delivery Information */}

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-orange-700 mb-4">
                  Delivery Information
                </h2>

                <p>
                  <strong>Tracking Number:</strong> {delivery.tracking_number}
                </p>

                <p>
                  <strong>Origin:</strong> {delivery.origin}
                </p>

                <p>
                  <strong>Destination:</strong> {delivery.destination}
                </p>

                <p>
                  <strong>Bus Number:</strong> {delivery.bus_number}
                </p>

                <p>
                  <strong>Departure Time:</strong>{" "}
                  {delivery.departure_time
                    ? new Date(delivery.departure_time).toLocaleString()
                    : "-"}
                </p>

                <p>
                  <strong>Expected Arrival:</strong>{" "}
                  {delivery.expected_arrival
                    ? new Date(delivery.expected_arrival).toLocaleString()
                    : "-"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      delivery.status === "Delivered"
                        ? "text-green-600"
                        : delivery.status === "In Transit"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-blue-700 mb-4">
                  Tracking History
                </h2>

                {history.length === 0 ? (
                  <p>No tracking history available.</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="border-l-4 border-blue-700 pl-4 mb-4"
                    >
                      <p className="font-semibold">{item.tracking_stage}</p>

                      <p>{item.location}</p>

                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </Wrapper>
  );
}

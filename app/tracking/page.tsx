"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../components/Sidebar";
import Wrapper from "../components/Wrapper";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

interface Delivery {
  tracking_number: string;
  type_of_shipment: string;
  shipment_mode: string;
  carrier: string;
  carrier_number: string;

  sender_firstname: string;
  sender_lastname: string;
  sender_phone: string;
  sender_company: string;
  sender_email: string;
  sender_address: string;

 

  receiver_firstname: string;
  receiver_lastname: string;
  receiver_phone: string;
  receiver_company: string;
  receiver_email: string;
  receiver_address: string;

  

  product: string;
  package_type: string;
  package_weight: string;
  package_description: string;
  package_length: string;
  package_width: string;
  package_height: string;
  package_value: string;

  reference_number: string;
  total_freight: string;

  origin: string;
  destination: string;

  departure_time: string;
  expected_arrival: string;

  tracking_stage: string;

  status: string;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [delivery, setDelivery] = useState<Delivery | null>(null);

  const [history, setHistory] = useState<any[]>([]);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);


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

  setLatitude(null);
  setLongitude(null);

  return;
}

  setDelivery(data);

  const { data: location } = await supabase
    .from("driver_locations")
    .select("*")
    .eq("delivery_id", data.id)
    .single();

  if (location) {
    setLatitude(Number(location.latitude));
    setLongitude(Number(location.longitude));
  } else {
    setLatitude(null);
    setLongitude(null);
  }

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
              {/* Shipment Information */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-blue-700 mb-4">
                  Shipment Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>Tracking Number:</strong> {delivery.tracking_number}
                  </p>
                  <p>
                    <strong>Reference Number:</strong>{" "}
                    {delivery.reference_number}
                  </p>

                  <p>
                    <strong>Shipment Mode:</strong> {delivery.shipment_mode}
                  </p>
                  <p>
                    <strong>Type of Shipment:</strong>{" "}
                    {delivery.type_of_shipment}
                  </p>

                  <p>
                    <strong>Carrier:</strong> {delivery.carrier}
                  </p>
                  <p>
                    <strong>Carrier Number:</strong> {delivery.carrier_number}
                  </p>

                  <p>
                    <strong>Product:</strong> {delivery.product}
                  </p>
                  <p>
                    <strong>Package:</strong> {delivery.package_type}
                  </p>

                  <p>
                    <strong>Total Freight:</strong> {delivery.total_freight}
                  </p>

                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 font-bold ${
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
              </div>

              {/* Sender */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-green-700 mb-4">
                  Sender Information
                </h2>

                <p>
                  <strong>Name:</strong> {delivery.sender_firstname}{" "}
                  {delivery.sender_lastname}
                </p>

                <p>
                  <strong>Company:</strong> {delivery.sender_company}
                </p>
                <p>
                  <strong>Phone:</strong> {delivery.sender_phone}
                </p>
                <p>
                  <strong>Email:</strong> {delivery.sender_email}
                </p>
                <p>
                  <strong>Address:</strong> {delivery.sender_address}
                </p>
               
              </div>

              {/* Receiver */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-purple-700 mb-4">
                  Receiver Information
                </h2>

                <p>
                  <strong>Name:</strong> {delivery.receiver_firstname}{" "}
                  {delivery.receiver_lastname}
                </p>

                <p>
                  <strong>Company:</strong> {delivery.receiver_company}
                </p>
                <p>
                  <strong>Phone:</strong> {delivery.receiver_phone}
                </p>
                <p>
                  <strong>Email:</strong> {delivery.receiver_email}
                </p>
                <p>
                  <strong>Address:</strong> {delivery.receiver_address}
                </p>
                <p>
                  <strong>Country:</strong> {delivery.receiver_country}
                </p>
              </div>

              {/* Package */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-orange-700 mb-4">
                  Package Information
                </h2>

                <p>
                  <strong>Weight:</strong> {delivery.package_weight}
                </p>
                <p>
                  <strong>Length:</strong> {delivery.package_length}
                </p>
                <p>
                  <strong>Width:</strong> {delivery.package_width}
                </p>
                <p>
                  <strong>Height:</strong> {delivery.package_height}
                </p>
                <p>
                  <strong>Value:</strong> {delivery.package_value}
                </p>

                <p className="mt-4">
                  <strong>Description:</strong>
                </p>

                <p>{delivery.package_description}</p>
              </div>

              {/* Route */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-red-700 mb-4">
                  Delivery Information
                </h2>

                <p>
                  <strong>Origin:</strong> {delivery.origin}
                </p>
                <p>
                  <strong>Destination:</strong> {delivery.destination}
                </p>

                <p>
                  <strong>Departure:</strong>{" "}
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
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-blue-700 mb-4">
                  Live Shipment Location
                </h2>

                {latitude && longitude ? (
                  <>
                    <p className="mb-4">
                      Current GPS location of your shipment.
                    </p>

                    <Map latitude={latitude} longitude={longitude} />
                  </>
                ) : (
                  <p className="text-gray-500">Location not available yet.</p>
                )}
              </div>

              {/* Tracking History */}
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

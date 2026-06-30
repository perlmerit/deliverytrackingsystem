"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

export default function GPSNavigationPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, []);

  async function fetchDeliveries() {
    const { data } = await supabase
      .from("deliveries")
      .select("id, tracking_number");

    setDeliveries(data || []);
  }

  useEffect(() => {
    if (selectedDelivery) {
      fetchDriverLocation();
    }
  }, [selectedDelivery]);

  async function fetchDriverLocation() {
    const { data, error } = await supabase
      .from("driver_locations")
      .select("*")
      .eq("delivery_id", selectedDelivery)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setLatitude(Number(data.latitude));
    setLongitude(Number(data.longitude));
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        toast.success("Location Retrieved");
      },
      () => {
        toast.error("Unable to get location");
      },
    );
  }

async function saveLocation() {
  if (!selectedDelivery) {
    toast.error("Please select a shipment first");
    return;
  }

  if (latitude === null || longitude === null) {
    toast.error("Get location first");
    return;
  }

  console.log("Saving...");
  console.log({
    delivery_id: Number(selectedDelivery),
    latitude,
    longitude,
  });

  const { data, error } = await supabase
    .from("driver_locations")
    .upsert(
      {
        delivery_id: Number(selectedDelivery),
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "delivery_id",
      },
    )
    .select();

  console.log("UPSERT DATA:", data);
  console.log("UPSERT ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  toast.success("Location Saved");
}
  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">GPS Navigation</h1>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">
                  Select Shipment
                </label>

                <select
                  value={selectedDelivery}
                  onChange={(e) => setSelectedDelivery(e.target.value)}
                  className="w-full p-4 border rounded-lg"
                >
                  <option value="">Select Tracking Number</option>

                  {deliveries.map((delivery: any) => (
                    <option key={delivery.id} value={delivery.id}>
                      {delivery.tracking_number}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={getCurrentLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Get Current Location
              </button>

              <div>
                <p>
                  <strong>Latitude:</strong> {latitude ?? "Not Available"}
                </p>

                <p>
                  <strong>Longitude:</strong> {longitude ?? "Not Available"}
                </p>
              </div>

              {latitude && longitude && (
                <div className="mt-6">
                  <Map latitude={latitude} longitude={longitude} />
                </div>
              )}

              <button
                onClick={saveLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Save Location
              </button>
            </div>
          </div>
        </main>

        <Toaster position="top-right" />
      </div>
    </Wrapper>
  );
}

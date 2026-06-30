"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";
import { sendTrackingEmail } from "@/lib/email";
import { countryCoordinates } from "@/lib/countryCoordinates";

interface Delivery {
  id: number;
  tracking_number: string;
}



export default function AddTrackingHistory() {
  const router = useRouter();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");

  const [form, setForm] = useState({
    delivery_id: "",
    tracking_stage: "",
    location: "",
  });

  useEffect(() => {
    fetchDeliveries();
     fetchWarehouses();
  }, []);

  async function fetchDeliveries()

  {
    const { data, error } = await supabase
      .from("deliveries")
      .select("id, tracking_number")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setDeliveries(data || []);
  }

    async function fetchWarehouses() {
      const { data, error } = await supabase
        .from("warehouses")
        .select("*")
        .order("warehouse_name");

      if (error) {
        console.log(error);
        return;
      }

      setWarehouses(data || []);
    }



async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  
  console.log("FORM DATA:", form);
  console.log("SELECTED WAREHOUSE:", selectedWarehouseId);

  const { error } = await supabase.from("tracking_history").insert([
    {
      delivery_id: Number(form.delivery_id),
      tracking_stage: form.tracking_stage,
      location: form.location,
    },
  ]);

console.log("TRACKING STAGE =", form.tracking_stage);

if (
  form.tracking_stage === "Received at Warehouse" ||
  form.tracking_stage === "Arrived at Branch"
) {
  const { data: movementData, error: movementError } = await supabase
    .from("warehouse_movements")
    .insert([
      {
        delivery_id: Number(form.delivery_id),
        warehouse_id: Number(selectedWarehouseId),
        movement_type: "Received",
        notes: form.location,
      },
    ])
    .select();

  console.log("MOVEMENT DATA:", movementData);
  console.log("MOVEMENT ERROR:", movementError);

  if (movementError) {
    alert(movementError.message);
  }
}

alert("TRACKING STAGE = " + form.tracking_stage);

if (form.tracking_stage === "Loaded onto Truck") {
  const { data: movementData, error: movementError } = await supabase
    .from("warehouse_movements")
    .insert([
      {
        delivery_id: Number(form.delivery_id),
        warehouse_id: Number(selectedWarehouseId),
        movement_type: "Dispatched",
        notes: form.location,
      },
    ])
    .select();

  console.log("MOVEMENT DATA:", movementData);
  console.log("MOVEMENT ERROR:", movementError);

  if (movementError) {
    alert(movementError.message);
  }
}

    const { data: updatedData, error: updateError } = await supabase
      .from("deliveries")
      .update({
        status: form.tracking_stage,
      })
      .eq("id", Number(form.delivery_id))
      .select();

    console.log("UPDATE RESULT:", updatedData);
    console.log("UPDATE ERROR:", updateError);

  // Get shipment information
  const { data: delivery } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", Number(form.delivery_id))
    .single();

    const warehouse = warehouses.find(
      (w) => w.id === Number(selectedWarehouseId),
    );
if (warehouse) {
  console.log("Warehouse Selected:", warehouse);

  const coords = countryCoordinates[warehouse.country];

  console.log("Coordinates Found:", coords);

  if (coords) {
    const { data, error: locationError } = await supabase
      .from("driver_locations")
      .upsert(
        {
          delivery_id: Number(form.delivery_id),
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          onConflict: "delivery_id",
        },
      )
      .select();

    console.log("Driver Location Updated:", data);
    console.log("Driver Location Error:", locationError);
  }
}
    console.log("About to send email...");
    console.log(delivery);

    console.log("Email sent successfully");

  

  // Send email notification
  if (delivery) {
    console.log("Receiver Email:", delivery.receiver_email);
  try {
    const result = await sendTrackingEmail(
      `${delivery.receiver_firstname} ${delivery.receiver_lastname}`,
      delivery.receiver_email,
      delivery.tracking_number,
      form.tracking_stage,
      form.location,
    );

    console.log("EMAIL RESULT:", result);
  } catch (err: any) {
    console.error("EMAIL ERROR:", err);

    alert(JSON.stringify(err, null, 2));
  }
  }

  toast.success("Tracking History Added");

  setTimeout(() => {
    router.push("/tracking-history");
  }, 1500);
}

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Add Tracking History</h1>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Shipment</label>

                <select
                  value={form.delivery_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      delivery_id: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                >
                  <option value="">Select Shipment</option>

                  {deliveries.map((delivery) => (
                    <option key={delivery.id} value={delivery.id}>
                      {delivery.tracking_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Tracking Stage
                </label>

                <select
                  value={form.tracking_stage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tracking_stage: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                >
                  <option value="">Select Stage</option>

                  <option value="Package Received">Package Received</option>

                  <option value="Received at Warehouse">
                    Received at Warehouse
                  </option>

                  <option value="Loaded onto Truck">Loaded onto Truck</option>

                  <option value="Received by Driver">Received by Driver</option>

                  <option value="In Transit">In Transit</option>

                  <option value="Arrived at Branch">Arrived at Branch</option>

                  <option value="Out for Delivery">Out for Delivery</option>

                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Warehouse</label>

                <select
                  value={selectedWarehouseId}
                  onChange={(e) => {
                    setSelectedWarehouseId(e.target.value);

                    const warehouse = warehouses.find(
                      (w) => w.id === Number(e.target.value),
                    );

                    setForm({
                      ...form,
                      location: warehouse?.warehouse_name || "",
                    });
                  }}
                  className="w-full p-4 border rounded-lg"
                  required
                >
                  <option value="">Select Warehouse</option>

                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.warehouse_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
              >
                Save Tracking Event
              </button>
            </form>
          </div>
        </main>

        <Toaster position="top-right" />
      </div>
    </Wrapper>
  );
}

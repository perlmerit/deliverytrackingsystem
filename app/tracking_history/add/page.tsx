"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";
import { sendTrackingEmail } from "@/lib/email";

interface Delivery {
  id: number;
  tracking_number: string;
}



export default function AddTrackingHistory() {
  const router = useRouter();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const [form, setForm] = useState({
    delivery_id: "",
    tracking_stage: "",
    location: "",
  });

  useEffect(() => {
    fetchDeliveries();
  }, []);

  async function fetchDeliveries() {
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

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const { error } = await supabase.from("tracking_history").insert([
    {
      delivery_id: Number(form.delivery_id),
      tracking_stage: form.tracking_stage,
      location: form.location,
    },
  ]);

  if (error) {
    toast.error(error.message);
    return;
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
                <label className="block mb-2 font-semibold">Location</label>

                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  placeholder="Example: Douala Warehouse"
                  required
                />
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

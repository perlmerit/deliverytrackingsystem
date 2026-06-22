"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";

interface Delivery {
  id: number;
  tracking_number: string;
}

const knownLocations = [
  "Douala Main Warehouse",
  "Yaounde Distribution Center",
  "Bafoussam Branch",
  "Bamenda Branch",
  "Limbe Branch",
  "Kribi Branch",
  "Garoua Branch",
  "Maroua Branch",

  "Lagos Hub - Nigeria",
  "Abuja Distribution Center - Nigeria",

  "Accra Main Warehouse - Ghana",
  "Kumasi Branch - Ghana",

  "Abidjan Central Warehouse - Ivory Coast",

  "Dakar Distribution Center - Senegal",

  "Libreville Branch - Gabon",

  "Brazzaville Branch - Congo",

  "Kinshasa Main Hub - DRC",

  "Kigali Distribution Center - Rwanda",

  "Kampala Branch - Uganda",

  "Nairobi Main Hub - Kenya",

  "Addis Ababa Logistics Center - Ethiopia",

  "Johannesburg Main Warehouse - South Africa",

  "Cape Town Branch - South Africa",

  "Customer Address",
  "Pickup Station",
  "Collection Point",
  "Last Mile Delivery Center",
];

export default function AddProofOfDelivery() {
  const router = useRouter();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const [form, setForm] = useState({
    delivery_id: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_signature: "",
    notes: "",
    location: "Customer Address",
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

    // Save POD

    const { error: podError } = await supabase
      .from("proof_of_delivery")
      .insert([
        {
          delivery_id: Number(form.delivery_id),
          receiver_name: form.receiver_name,
          receiver_phone: form.receiver_phone,
          receiver_signature: form.receiver_signature,
          notes: form.notes,
          location: "Customer Address",
        },
      ]);

    if (podError) {
      toast.error(podError.message);
      return;
    }

    // Add Delivered stage to Tracking History

    const { error: trackingError } = await supabase
      .from("tracking_history")
      .insert([
        {
          delivery_id: Number(form.delivery_id),
          tracking_stage: "Delivered",
          location: "Customer Address",
        },
      ]);

    if (trackingError) {
      console.log(trackingError);
    }

    // Update Delivery Status

    const { error: deliveryError } = await supabase
      .from("deliveries")
      .update({
        tracking_stage: "Delivered",
        status: "Delivered",
      })
      .eq("id", Number(form.delivery_id));

    if (deliveryError) {
      console.log(deliveryError);
    }

    toast.success("Proof Of Delivery Saved");

    setTimeout(() => {
      router.push("/proof-of-delivery");
    }, 1500);
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Add Proof Of Delivery</h1>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Delivery */}

              <div>
                <label className="block mb-2 font-semibold">Delivery</label>

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
                  <option value="">Select Delivery</option>

                  {deliveries.map((delivery) => (
                    <option key={delivery.id} value={delivery.id}>
                      {delivery.tracking_number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receiver Name */}

              <div>
                <label className="block mb-2 font-semibold">
                  Receiver Name
                </label>

                <input
                  type="text"
                  value={form.receiver_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      receiver_name: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                />
              </div>

              {/* Receiver Phone */}

              <div>
                <label className="block mb-2 font-semibold">
                  Receiver Phone
                </label>

                <input
                  type="text"
                  value={form.receiver_phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      receiver_phone: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                />
              </div>

              {/* Signature */}

              <div>
                <label className="block mb-2 font-semibold">
                  Receiver Signature
                </label>

                <input
                  type="text"
                  value={form.receiver_signature}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      receiver_signature: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                />
              </div>

              {/* Notes */}

              <div>
                <label className="block mb-2 font-semibold">Notes</label>

                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Delivery Location
                </label>

                <select
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                >
                  {knownLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
              >
                Save POD
              </button>
            </form>
          </div>
        </main>

        <Toaster position="top-right" />
      </div>
    </Wrapper>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";

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

export default function EditProofOfDelivery() {
  const params = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    receiver_signature: "",
    notes: "",
    location: "Customer Address",
  });

  useEffect(() => {
    if (params?.id) {
      fetchPOD();
    }
  }, [params]);

  async function fetchPOD() {
    const podId = Number(params.id);

    if (isNaN(podId)) {
      toast.error("Invalid POD ID");
      return;
    }

    const { data, error } = await supabase
      .from("proof_of_delivery")
      .select("*")
      .eq("id", podId)
      .single();

    if (error) {
      console.log(error);
      toast.error("Failed to load POD");
      return;
    }

    setForm({
      receiver_name: data.receiver_name || "",
      receiver_phone: data.receiver_phone || "",
      receiver_signature: data.receiver_signature || "",
      notes: data.notes || "",
      location: data.location || "Customer Address",
    });
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const podId = Number(params.id);

    if (isNaN(podId)) {
      toast.error("Invalid POD ID");
      return;
    }

    const { error } = await supabase
      .from("proof_of_delivery")
      .update({
        receiver_name: form.receiver_name,
        receiver_phone: form.receiver_phone,
        receiver_signature: form.receiver_signature,
        notes: form.notes,
        location: form.location,
      })
      .eq("id", podId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Proof Of Delivery Updated");

    setTimeout(() => {
      router.push("/proof-of-delivery");
    }, 1500);
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Edit Proof Of Delivery</h1>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleUpdate} className="space-y-4">
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
                />
              </div>

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
                />
              </div>

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

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
              >
                Update POD
              </button>
            </form>
          </div>
        </main>

        <Toaster position="top-right" />
      </div>
    </Wrapper>
  );
}

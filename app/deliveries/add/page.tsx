"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";

interface Delivery {
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  origin: string;
  destination: string;
  status: string;
}

const doualaCities = [
  "Akwa",
  "Bonaberi",
  "Bonamoussadi",
  "Makepe",
  "Deido",
  "Bepanda",
  "Logbessou",
  "Kotto",
  "PK8",
  "PK10",
  "PK11",
  "Yassa",
  "Ndogbong",
  "Ndogpassi",
  "New Bell",
  "Bonapriso",
  "Bali",
  "Cité SIC",
  "Village",
  "Japoma",
];

export default function AddDelivery() {
  const router = useRouter();

  const [form, setForm] = useState<Delivery>({
    tracking_number: "",
    customer_name: "",
    customer_phone: "",
    origin: "",
    destination: "",
    status: "Pending",
  });

  useEffect(() => {
    const tracking = "TRK" + Math.floor(100000 + Math.random() * 900000);

    setForm((prev) => ({
      ...prev,
      tracking_number: tracking,
    }));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.from("deliveries").insert([form]);

    if (error) {
      console.log(error);
      toast.error(error.message);
    } else {
      toast.success("Delivery Added Successfully");

      setTimeout(() => {
        router.push("/deliveries");
      }, 1500);
    }
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

       
        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Add Delivery</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold">
                  Tracking Number
                </label>

                <input
                  type="text"
                  value={form.tracking_number}
                  readOnly
                  className="w-full p-4 border rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_name: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Customer Phone
                </label>

                <input
                  type="text"
                  value={form.customer_phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_phone: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Origin</label>

                <select
                  value={form.origin}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      origin: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                >
                  <option value="" disabled>
                    Select Origin
                  </option>

                  {doualaCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Destination</label>

                <select
                  value={form.destination}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      destination: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                  required
                >
                  <option value="" disabled>
                    Select Destination
                  </option>

                  {doualaCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-4 border rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg"
              >
                Save Delivery
              </button>
            </form>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </Wrapper>
  );
}

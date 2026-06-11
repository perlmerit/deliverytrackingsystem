"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
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

export default function EditDelivery() {
  const params = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Delivery>({
    tracking_number: "",
    customer_name: "",
    customer_phone: "",
    origin: "",
    destination: "",
    status: "",
  });

  useEffect(() => {
    fetchDelivery();
  }, []);

  async function fetchDelivery() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.log(error);
      toast.error("Failed to load delivery");
      return;
    }

    setForm(data);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase
      .from("deliveries")
      .update(form)
      .eq("id", params.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Delivery Updated Successfully");

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
          <h1 className="text-4xl font-bold mb-8 text-slate-800">
            Edit Delivery
          </h1>

          <form
            onSubmit={handleUpdate}
            className="bg-white max-w-4xl p-8 rounded-2xl shadow-lg space-y-5"
          >
            <div>
              <label className="block mb-2 font-semibold">
                Tracking Number
              </label>

              <input
                type="text"
                value={form.tracking_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tracking_number: e.target.value,
                  })
                }
                className="w-full p-4 border rounded-lg bg-blue-50"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Customer Name</label>

              <input
                type="text"
                value={form.customer_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_name: e.target.value,
                  })
                }
                className="w-full p-4 border rounded-lg bg-blue-50"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Customer Phone</label>

              <input
                type="text"
                value={form.customer_phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_phone: e.target.value,
                  })
                }
                className="w-full p-4 border rounded-lg bg-blue-50"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Origin</label>

              <input
                type="text"
                value={form.origin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    origin: e.target.value,
                  })
                }
                className="w-full p-4 border rounded-lg bg-blue-50"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Destination</label>

              <input
                type="text"
                value={form.destination}
                onChange={(e) =>
                  setForm({
                    ...form,
                    destination: e.target.value,
                  })
                }
                className="w-full p-4 border rounded-lg bg-blue-50"
              />
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
                className="w-full p-4 border rounded-lg bg-blue-50"
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Update Delivery
            </button>
          </form>
        </main>
      </div>

      <Toaster position="top-right" />
    </Wrapper>
  );
}

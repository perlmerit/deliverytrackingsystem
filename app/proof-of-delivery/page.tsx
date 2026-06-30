"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface POD {
  id: number;
  receiver_name: string;
  receiver_phone: string;
  receiver_signature: string;
  notes: string;
  delivered_at: string;
  location: string;

  deliveries: {
    tracking_number: string;
  };
}

export default function ProofOfDeliveryPage() {
  const [pods, setPods] = useState<POD[]>([]);

  useEffect(() => {
    fetchPods();
  }, []);

  async function fetchPods() {
    const { data, error } = await supabase
      .from("proof_of_delivery")
      .select(
        `
        *,
        deliveries (
          tracking_number
        )
      `,
      )
      .order("delivered_at", { ascending: false });

    if (error) {
      console.log(error);
      toast.error("Failed to load POD records");
      return;
    }

    setPods(data || []);
  }

  async function deletePOD(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this POD record?",
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("proof_of_delivery")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("POD Deleted");

    fetchPods();
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Proof Of Delivery</h1>

            <Link href="/proof-of-delivery/add">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg">
                Add POD
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-4 text-left">Tracking Number</th>

                  <th className="p-4 text-left">Receiver</th>

                  <th className="p-4 text-left">Phone</th>

                  <th className="p-4 text-left">Signature</th>

                  <th className="p-4 text-left">Notes</th>

                  <th className="p-4 text-left">Delivered At</th>

                  <th className="p-4">Location</th>

                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pods.map((pod) => (
                  <tr key={pod.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">
                      {pod.deliveries?.tracking_number}
                    </td>

                    <td className="p-4">{pod.receiver_name}</td>

                    <td className="p-4">{pod.receiver_phone}</td>

                    <td className="p-4">{pod.receiver_signature}</td>

                    <td className="p-4">{pod.notes}</td>

                    <td className="p-4">
                      {new Date(pod.delivered_at).toLocaleString()}
                    </td>

                    <td className="p-4">{pod.location}</td>

                    <td className="p-4 flex gap-2">
                      <Link href={`/proof-of-delivery/edit/${pod.id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => deletePOD(pod.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {pods.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No Proof Of Delivery Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        <Toaster position="top-right" />
      </div>
    </Wrapper>
  );
}

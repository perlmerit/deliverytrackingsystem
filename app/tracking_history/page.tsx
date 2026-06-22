"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface TrackingHistory {
  id: number;
  delivery_id: number;
  tracking_stage: string;
  location: string;
  created_at: string;

  deliveries?: {
    tracking_number: string;
  };
}

export default function TrackingHistoryPage() {
  const [history, setHistory] = useState<TrackingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
   const { data, error } = await supabase
     .from("tracking_history")
     .select(
       `
  *,
  deliveries (
    tracking_number
  )
`,
     )
     .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      toast.error("Failed to load tracking history");
      return;
    }

    setHistory(data || []);
    setLoading(false);
  }

  async function deleteHistory(id: number) {
    const confirmDelete = window.confirm(
      "Delete this tracking history record?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("tracking_history")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Tracking history deleted");

    fetchHistory();
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Tracking History</h1>

            <Link href="/tracking-history/add">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg">
                Add Tracking Event
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-8 shadow">Loading...</div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow text-center text-gray-500">
              No Tracking History Found
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-blue-700">
                        {item.deliveries?.tracking_number}
                      </h2>

                      <p className="text-gray-500 text-sm">
                        Delivery ID #{item.delivery_id}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteHistory(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 border-l-4 border-blue-700 pl-6">
                    <div className="mb-4">
                      <p className="font-semibold text-lg">
                        {item.tracking_stage}
                      </p>

                      <p className="text-gray-600">{item.location}</p>

                      <p className="text-sm text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Toaster position="top-right" />
      </div>
    </Wrapper>
  );
}
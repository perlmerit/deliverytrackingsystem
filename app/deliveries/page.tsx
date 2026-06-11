"use client";

import { useEffect, useState, Fragment } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import Swal from "sweetalert2";
import { Toaster } from "react-hot-toast";
import Wrapper from "../components/Wrapper";

interface Delivery {
  id?: string;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  origin: string;
  destination: string;
  status: string;
}

const Delivery = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  async function fetchDeliveries() {
    const { data, error } = await supabase.from("deliveries").select("*");

    if (error) {
      console.log(error);
      return;
    }

    setDeliveries(data || []);
  }

  async function handleDeliveryDelete(id: string) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This delivery will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("deliveries").delete().eq("id", id);

      if (error) {
        Swal.fire("Error", "Failed to delete", "error");
      } else {
        Swal.fire("Deleted!", "Delivery deleted successfully.", "success");

        fetchDeliveries();
      }
    }
  }

  return (
    <Wrapper>
      <Fragment>
        <div className="min-h-screen bg-gray-100">
          <Sidebar />

         
          <main className="ml-64 p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Deliveries</h1>

              <Link href="/deliveries/add">
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg">
                  Add Delivery
                </button>
              </Link>
            </div>

            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="p-4 text-left">Tracking No</th>

                      <th className="p-4 text-left">Customer</th>

                      <th className="p-4 text-left">Phone</th>

                      <th className="p-4 text-left">Origin</th>

                      <th className="p-4 text-left">Destination</th>

                      <th className="p-4 text-left">Status</th>

                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr
                        key={delivery.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">{delivery.tracking_number}</td>

                        <td className="p-4">{delivery.customer_name}</td>

                        <td className="p-4">{delivery.customer_phone}</td>

                        <td className="p-4">{delivery.origin}</td>

                        <td className="p-4">{delivery.destination}</td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-sm ${
                              delivery.status === "Delivered"
                                ? "bg-green-600"
                                : delivery.status === "In Transit"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          >
                            {delivery.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Link href={`/deliveries/edit/${delivery.id}`}>
                              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                Edit
                              </button>
                            </Link>

                            <button
                              onClick={() =>
                                delivery.id && handleDeliveryDelete(delivery.id)
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {deliveries.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center p-8 text-gray-500"
                        >
                          No deliveries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        <Toaster />
      </Fragment>
    </Wrapper>
  );
};

export default Delivery;

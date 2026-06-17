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

  sender_name: string;
  sender_phone: string;

  receiver_name: string;
  receiver_phone: string;

  package_weight: string;
  package_description: string;

  origin: string;
  destination: string;

  bus_number: "";
  departure_time: "";
  expected_arrival: "";

  tracking_stage: string;

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
                <table className="min-w-[1800px]">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="p-4 text-left">Tracking No</th>

                      <th className="p-4 text-left">Sender</th>

                      <th className="p-4 text-left">Sender Phone</th>

                      <th className="p-4 text-left">Receiver</th>

                      <th className="p-4 text-left">Receiver Phone</th>

                      <th className="p-4 text-left">Weight</th>

                      <th className="p-4 text-left">Origin</th>

                      <th className="p-4 text-left">Destination</th>

                      <th className="p-4 text-left">Bus Number</th>

                      <th className="p-4 text-left">Departure Time</th>

                      <th className="p-4 text-left">Expecetd Arrival</th>

                      <th className="p-4 text-left">Tracking Stage</th>

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
                        <td className="min-w-[180px]">
                          {delivery.tracking_number}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.sender_name}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.sender_phone}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.receiver_name}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.receiver_phone}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.package_weight}
                        </td>

                        <td className="p-4 min-w-[180px]">{delivery.origin}</td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.destination}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.bus_number}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.departure_time
                            ? new Date(delivery.departure_time).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-4 min-w-[180px]">
                          {delivery.expected_arrival
                            ? new Date(
                                delivery.expected_arrival,
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-4 min-w-[180px]">{delivery.tracking_stage}</td>

                        <td className="p-4 min-w-[180px]">
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

                        <td className="p-4 min-w-[180px]">
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
                          colSpan={10}
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

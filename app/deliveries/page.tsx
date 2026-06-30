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
  type_of_shipment: string;
  shipment_mode: string;
  carrier: string;
  carrier_number: string;

  sender_firstname: string;
  sender_lastname: string;
  sender_phone: string;
  sender_company: string;
  sender_email: string;
  sender_address: string;


  receiver_firstname: string;
  receiver_lastname: string;
  receiver_phone: string;
  receiver_company: string;
  receiver_email: string;
  receiver_address: string;


  product: string;
  package_weight: string;
  package_description: string;
  package_length: string;
  package_width: string;
  package_height: string;
  package_value: string;

  reference_number: string;
  total_freight: string;

  origin: string;
  destination: string;

  departure_time: string;
  expected_arrival: string;

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
                <table className="min-w-max w-full text-sm">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="p-4 text-left">Tracking No</th>

                      <th className="p-4 text-left">Shipment Type</th>

                      <th className="p-4 text-left">Shipment Mode</th>

                      <th className="p-4 text-left">Carrier</th>

                      <th className="p-4 text-left">Carrier Number</th>

                      <th className="p-4 text-left">Sender First Name</th>

                      <th className="p-4 text-left">SenderLast Name</th>

                      <th className="p-4 text-left">Sender_phone</th>

                      <th className="p-4 text-left">Sender Company</th>

                      <th className="p-4 text-left">Sender Email</th>

                      <th className="p-4 text-left">Sender Address</th>

                     

                      <th className="p-4 text-left">Receiver First Name</th>

                      <th className="p-4 text-left">Receiver Last Name</th>

                      <th className="p-4 text-left">Receiver Phone</th>

                      <th className="p-4 text-left">Receiver Company</th>

                      <th className="p-4 text-left">Receiver Email</th>

                      <th className="p-4 text-left">Receiver Address</th>

                     

                      <th className="p-4 text-left">Product</th>

                      <th className="p-4 text-left">Package Weight</th>

                      <th className="p-4 text-left">Package Description</th>

                      <th className="p-4 text-left">Package Length</th>

                      <th className="p-4 text-left">Package Width</th>

                      <th className="p-4 text-left">Package Height</th>

                      <th className="p-4 text-left">Package Value</th>

                      <th className="p-4 text-left">Reference Number</th>

                      <th className="p-4 text-left">Total Freight</th>

                      <th className="p-4 text-left">Origin</th>

                      <th className="p-4 text-left">Destination</th>

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
                        <td className="p-4  whitespace-nowrap">
                          {delivery.tracking_number}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.type_of_shipment}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.shipment_mode}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.carrier}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.carrier_number}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.sender_firstname}
                        </td>

                        {/* Sender */}

                        <td className="p-4  whitespace-nowrap">
                          {delivery.sender_lastname}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.sender_phone}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.sender_company}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.sender_email}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.sender_address}
                        </td>

                        

                        {/* Receiver */}
                        <td className="p-4  whitespace-nowrap">
                          {delivery.receiver_firstname}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.receiver_lastname}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.receiver_phone}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.receiver_company}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.receiver_email}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.receiver_address}
                        </td>

                        

                        {/* Package */}
                        <td className="p-4  whitespace-nowrap">
                          {delivery.product}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.package_weight}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.package_description}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.package_length}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.package_width}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.package_height}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.package_value}
                        </td>

                        {/* Delivery */}

                        <td className="p-4  whitespace-nowrap">
                          {delivery.reference_number}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.total_freight}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.origin}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {delivery.destination}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.departure_time
                            ? new Date(delivery.departure_time).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.expected_arrival
                            ? new Date(
                                delivery.expected_arrival,
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {delivery.tracking_stage}
                        </td>

                        <td className="p-4  whitespace-nowrap">
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

                        <td className="p-4  whitespace-nowrap">
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
                          colSpan={30}
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

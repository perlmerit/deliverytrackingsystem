"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";

interface Delivery {
  tracking_number: string;

  sender_name: string;
  sender_phone: string;

  receiver_name: string;
  receiver_phone: string;

  package_weight: string;
  package_description: string;

  origin: string;
  destination: string;

  bus_number: string;
  departure_time: string;
  expected_arrival: string;

  tracking_stage: string;

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

export default function EditDelivery() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<Delivery>({
    tracking_number: "",

    sender_name: "",
    sender_phone: "",

    receiver_name: "",
    receiver_phone: "",

    package_weight: "",
    package_description: "",

    origin: "",
    destination: "",

    bus_number: "",
    departure_time: "",
    expected_arrival: "",

    tracking_stage: "Package Received",

    status: "Pending",
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

   let status = "Pending";

   if (
     form.tracking_stage === "Loaded Into Bus" ||
     form.tracking_stage === "Bus Left Origin" 
     
   ) {
     status = "In Transit";
   }

   if (form.tracking_stage === "Arrived at Destination") {
     status = "Arrived ";
   }

   if (form.tracking_stage === "Ready For Pickup") {
     status = "Ready For Pickup";
   }

   if (form.tracking_stage === "Delivered") {
     status = "Delivered";
   }

   const updatedForm = {
     ...form,
     status,
   };

   const { error } = await supabase
     .from("deliveries")
     .update(updatedForm)
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
          <h1 className="text-4xl font-bold mb-8">Edit Delivery</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Stepper Header */}

              <div className="flex justify-center gap-4 mb-8">
                <div
                  className={`${step >= 1 ? "bg-blue-700 text-white" : "bg-gray-300"} px-4 py-2 rounded-full`}
                >
                  Sender
                </div>

                <div
                  className={`${step >= 2 ? "bg-blue-700 text-white" : "bg-gray-300"} px-4 py-2 rounded-full`}
                >
                  Receiver
                </div>

                <div
                  className={`${step >= 3 ? "bg-blue-700 text-white" : "bg-gray-300"} px-4 py-2 rounded-full`}
                >
                  Package
                </div>

                <div
                  className={`${step >= 4 ? "bg-blue-700 text-white" : "bg-gray-300"} px-4 py-2 rounded-full`}
                >
                  Delivery
                </div>
              </div>

              {/* STEP 1 */}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Sender Information</h2>

                  <input
                    type="text"
                    placeholder="Sender Name"
                    value={form.sender_name}
                    onChange={(e) =>
                      setForm({ ...form, sender_name: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Sender Phone"
                    value={form.sender_phone}
                    onChange={(e) =>
                      setForm({ ...form, sender_phone: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Receiver Information</h2>

                  <input
                    type="text"
                    placeholder="Receiver Name"
                    value={form.receiver_name}
                    onChange={(e) =>
                      setForm({ ...form, receiver_name: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Receiver Phone"
                    value={form.receiver_phone}
                    onChange={(e) =>
                      setForm({ ...form, receiver_phone: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  />

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Package Information</h2>

                  <input
                    type="text"
                    placeholder="Package Name"
                    value={form.package_weight}
                    onChange={(e) =>
                      setForm({ ...form, package_weight: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  />

                  <textarea
                    placeholder="Package Description"
                    rows={4}
                    value={form.package_description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        package_description: e.target.value,
                      })
                    }
                    className="w-full p-4 border rounded-lg"
                  />

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Delivery Information</h2>

                  <input
                    type="text"
                    value={form.tracking_number}
                    readOnly
                    className="w-full p-4 border rounded-lg bg-gray-100"
                  />

                  <select
                    value={form.origin}
                    onChange={(e) =>
                      setForm({ ...form, origin: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  >
                    {doualaCities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>

                  <select
                    value={form.destination}
                    onChange={(e) =>
                      setForm({ ...form, destination: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg"
                  >
                    {doualaCities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                  <div>
                    <label className="block mb-2 font-semibold">
                      Bus Number
                    </label>

                    <input
                      type="text"
                      value={form.bus_number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          bus_number: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Departure Time
                    </label>

                    <input
                      type="datetime-local"
                      value={form.departure_time}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          departure_time: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Expected Arrival Time
                    </label>

                    <input
                      type="datetime-local"
                      value={form.expected_arrival}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          expected_arrival: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
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
                    >
                      <option value="Package Received">Package Received</option>

                      <option value="Loaded Into Bus">Loaded Into Bus</option>

                      <option value="Bus Left Bonaberi">
                        Bus Left Origin
                      </option>

                      <option value="Arrived Bafoussam">
                        Arrived Destination
                      </option>

                      <option value="Ready For Pickup">Ready For Pickup</option>

                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="bg-green-600 text-white px-8 py-3 rounded-lg"
                    >
                      Update Delivery
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </Wrapper>
  );
}

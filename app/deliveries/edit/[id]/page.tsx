"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";

interface Delivery {
  tracking_number: string;

  sender_firstname: string;
  sender_lastname: string;
  sender_phone: string;
  sender_company: string;
  sender_email: string;
  sender_address: string;
  sender_region: string;
  sender_country: string;

  receiver_firstname: string;
  receiver_lastname: string;
  receiver_company: string;
  receiver_phone: string;
  receiver_email: string;
  receiver_address: string;
  receiver_region: string;
  receiver_country: string;

  package_weight: string;
  package_description: string;
  package_length: string;
  package_width: string;
  package_height: string;
  package_value: string;

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

    sender_firstname: "",
    sender_lastname: "",
    sender_phone: "",
    sender_company: "",
    sender_email: "",
    sender_address: "",
    sender_region: "",
    sender_country: "",

    receiver_firstname: "",
    receiver_lastname: "",
    receiver_phone: "",
    receiver_company: "",
    receiver_email: "",
    receiver_address: "",
    receiver_region: "",
    receiver_country: "",

    package_weight: "",
    package_description: "",
    package_length: "",
    package_width: "",
    package_height: "",
    package_value: "",

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
     form.tracking_stage === "Loaded onto Truck" ||
     form.tracking_stage === "Received by Driver" ||
     form.tracking_stage === "In Transit"
   ) {
     status = "In Transit";
   }

   if (form.tracking_stage === "Arrived at Branch") {
     status = "Arrived at Branch";
   }

   if (form.tracking_stage === "Out for Delivery") {
     status = "Out for Delivery";
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

  const { error: trackingError } = await supabase
    .from("tracking_history")
    .insert([
      {
        delivery_id: Number(params.id),
        stage: form.tracking_stage,
        location: form.origin,
      },
    ]);

  if (trackingError) {
    console.log("TRACKING ERROR:", trackingError);
    toast.error("Failed to save tracking history");
  } else {
    console.log("Tracking history saved successfully");
  }

     if (trackingError) {
       console.log(trackingError);
     }

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

                  <div>
                    <label className="block mb-2 font-semibold">
                      First Name
                    </label>

                    <input
                      type="text"
                      required
                      value={form.sender_firstname}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sender_firstname: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Last Name
                    </label>

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={form.sender_lastname}
                      onChange={(e) =>
                        setForm({ ...form, sender_lastname: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">
                      Telelphone
                    </label>

                    <input
                      type="text"
                      placeholder="Telephone"
                      value={form.sender_phone}
                      onChange={(e) =>
                        setForm({ ...form, sender_phone: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Company Name
                    </label>

                    <input
                      type="text"
                      placeholder="Company Name"
                      value={form.sender_company}
                      onChange={(e) =>
                        setForm({ ...form, sender_company: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.sender_email}
                      onChange={(e) =>
                        setForm({ ...form, sender_email: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Addrees</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={form.sender_address}
                      onChange={(e) =>
                        setForm({ ...form, sender_address: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Region</label>
                    <input
                      type="text"
                      placeholder="Region"
                      value={form.sender_region}
                      onChange={(e) =>
                        setForm({ ...form, sender_region: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Country</label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={form.sender_country}
                      onChange={(e) =>
                        setForm({ ...form, sender_country: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

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

                  <div>
                    <label className="block mb-2 font-semibold">
                      First Name
                    </label>

                    <input
                      type="text"
                      required
                      value={form.receiver_firstname}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          receiver_firstname: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">
                      Last Name
                    </label>

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={form.receiver_lastname}
                      onChange={(e) =>
                        setForm({ ...form, receiver_lastname: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Telelphone
                    </label>

                    <input
                      type="text"
                      placeholder="Telephone"
                      value={form.receiver_phone}
                      onChange={(e) =>
                        setForm({ ...form, receiver_phone: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Company Name
                    </label>

                    <input
                      type="text"
                      placeholder="Company Name"
                      value={form.receiver_company}
                      onChange={(e) =>
                        setForm({ ...form, receiver_company: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.receiver_email}
                      onChange={(e) =>
                        setForm({ ...form, receiver_email: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Addrees</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={form.receiver_address}
                      onChange={(e) =>
                        setForm({ ...form, receiver_address: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Region</label>
                    <input
                      type="text"
                      placeholder="Region"
                      value={form.receiver_region}
                      onChange={(e) =>
                        setForm({ ...form, receiver_region: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Country</label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={form.receiver_country}
                      onChange={(e) =>
                        setForm({ ...form, receiver_country: e.target.value })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

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

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Weight
                    </label>

                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={form.package_weight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_weight: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>
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

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Length
                    </label>

                    <input
                      type="text"
                      placeholder="Length"
                      value={form.package_length}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_length: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Width
                    </label>

                    <input
                      type="text"
                      placeholder="Width"
                      value={form.package_width}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_width: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Height
                    </label>

                    <input
                      type="text"
                      placeholder="Height"
                      value={form.package_height}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_height: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Value (FCFA)
                    </label>

                    <input
                      type="number"
                      placeholder="Package Value (FCFA)"
                      value={form.package_value}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_value: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

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

                      <option value="Received at Warehouse">
                        Received at Warehouse
                      </option>

                      <option value="Loaded onto Truck">
                        Loaded onto Truck
                      </option>

                      <option value="Received by Driver">
                        Received by Driver
                      </option>

                      <option value="In Transit">In Transit</option>

                      <option value="Arrived at Branch">
                        Arrived at Branch
                      </option>

                      <option value="Out for Delivery">Out for Delivery</option>

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

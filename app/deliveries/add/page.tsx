"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
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

export default function AddDelivery() {
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
    const tracking = "TRK" + Math.floor(100000 + Math.random() * 900000);

    setForm((prev) => ({
      ...prev,
      tracking_number: tracking,
    }));
  }, []);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();

   console.log("FORM SUBMITTED", form);

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
              {/* Step Indicator */}

              <div className="flex justify-center gap-4 mb-8">
                <div className={step >= 1 ? "font-bold text-blue-700" : ""}>
                  1. Sender
                </div>

                <div className={step >= 2 ? "font-bold text-blue-700" : ""}>
                  2. Receiver
                </div>

                <div className={step >= 3 ? "font-bold text-blue-700" : ""}>
                  3. Package
                </div>

                <div className={step >= 4 ? "font-bold text-blue-700" : ""}>
                  4. Delivery
                </div>
              </div>

              {/* STEP 1 */}

              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold">Sender Information</h2>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Sender Name
                    </label>

                    <input
                      type="text"
                      required
                      value={form.sender_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sender_name: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Sender Phone
                    </label>

                    <input
                      type="text"
                      value={form.sender_phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sender_phone: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold">Receiver Information</h2>

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
                </>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold">Package Information</h2>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Weight
                    </label>

                    <input
                      type="text"
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

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Description
                    </label>

                    <textarea
                      value={form.package_description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_description: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <>
                  <h2 className="text-2xl font-bold">Delivery Information</h2>

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
                    >
                      <option value="">Select Origin</option>

                      {doualaCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Destination
                    </label>

                    <select
                      value={form.destination}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          destination: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    >
                      <option value="">Select Destination</option>

                      {doualaCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

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

                
                </>
              )}

              {/* Navigation Buttons */}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg"
                  >
                    Previous
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-3 rounded-lg ml-auto"
                  >
                    Save Delivery
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </Wrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";
import { countryCoordinates } from "@/lib/countryCoordinates";

interface Delivery {
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
  package_type: string;
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

const countries = [
  "Cameroon",
  "Nigeria",
  "Ghana",
  "Togo",
  "Benin",
  "Ivory Coast",
  "Senegal",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Chad",
  "Central African Republic",
  "Republic of the Congo",
  "Democratic Republic of the Congo",
  "Gabon",
  "Equatorial Guinea",
  "South Africa",
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Ethiopia",
  "Morocco",
  "Algeria",
  "Tunisia",
  "Egypt",
  "France",
  "Germany",
  "Belgium",
  "Netherlands",
  "Spain",
  "Italy",
  "United Kingdom",
  "United States",
  "Canada",
  "Brazil",
  "Turkey",
  "United Arab Emirates",
  "Saudi Arabia",
  "China",
  "India",
  "Japan",
  "South Korea",
  "Australia",
];

export default function AddDelivery() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<Delivery>({
    tracking_number: "",
    type_of_shipment: "",
    shipment_mode: "",
    carrier: "",
    carrier_number: "",

    sender_firstname: "",
    sender_lastname: "",
    sender_phone: "",
    sender_company: "",
    sender_email: "",
    sender_address: "",


    receiver_firstname: "",
    receiver_lastname: "",
    receiver_phone: "",
    receiver_company: "",
    receiver_email: "",
    receiver_address: "",
    

    product: "",
    package_type: "",
    package_weight: "",
    package_description: "",
    package_length: "",
    package_width: "",
    package_height: "",
    package_value: "",

    reference_number: "",
    total_freight: "",

    origin: "",
    destination: "",

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

   // 1. Create delivery
   const { data, error } = await supabase
     .from("deliveries")
     .insert([form])
     .select()
     .single();

   if (error) {
     console.log("INSERT ERROR:", error);
     console.log("MESSAGE:", error.message);
     console.log("DETAILS:", error.details);
     console.log("HINT:", error.hint);

     toast.error(error.message);
     return;
   }

   console.log("NEW DELIVERY:", data);
   console.log("DELIVERY ID:", data.id);

   const coords = countryCoordinates[form.origin];

   if (coords) {
     const { error: gpsError } = await supabase
       .from("driver_locations")
       .insert([
         {
           delivery_id: data.id,
           latitude: coords.lat,
           longitude: coords.lng,
         },
       ]);

     if (gpsError) {
       console.log("GPS INSERT ERROR:", gpsError);
     } else {
       console.log("Initial GPS location saved.");
     }
   }

   // 2. Create first tracking record
   const { error: trackingError } = await supabase

 
     .from("tracking_history")
     .insert([
       {
         delivery_id: data.id,
         stage: "Package Received",
         location: form.origin,
       },
     ]);

       console.log("TRACKING INSERT STARTED");
       
if (trackingError) {
  console.log("TRACKING ERROR:", trackingError);
  toast.error(trackingError.message);
} else {
  console.log("Tracking history created");
}

   toast.success("Delivery Added Successfully");

   setTimeout(() => {
     router.push("/deliveries");
   }, 1500);
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
                      SenderFirst Name
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

                  
                </>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <>
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

                  
                </>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold">Package Information</h2>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Type of Shipment
                    </label>

                    <select
                      value={form.type_of_shipment}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type_of_shipment: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                      required
                    >
                      <option value="">Select Shipment Type</option>

                      <option value="Document">Document</option>
                      <option value="Parcel">Parcel</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Fragile Goods">Fragile Goods</option>
                      <option value="Medical Supplies">Medical Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Product</label>

                    <input
                      type="text"
                      value={form.product}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          product: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Type
                    </label>

                    <select
                      value={form.package_type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          package_type: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                      required
                    >
                      <option value="">Select Package Type</option>

                      <option value="1 Box">1 Box</option>
                      <option value="2 Boxes">2 Boxes</option>

                      <option value="1 Carton">1 Carton</option>
                      <option value="2 Cartons">2 Cartons</option>

                      <option value="1 Package">1 Package</option>
                      <option value="5 Packages">5 Packages</option>

                      <option value="1 Pallet">1 Pallet</option>
                      <option value="2 Pallets">2 Pallets</option>

                      <option value="1 Crate">1 Crate</option>
                      <option value="2 Crates">2 Crates</option>

                      <option value="1 Container">1 Container</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Package Weight
                    </label>

                    <input
                      type="number"
                      placeholder="Package Weight"
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
                      Package Value
                    </label>

                    <input
                      type="number"
                      placeholder="Package Value"
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
                    <label className="block mb-2 font-semibold">
                      Reference Number
                    </label>

                    <input
                      type="text"
                      value={form.reference_number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          reference_number: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Total Freight
                    </label>

                    <input
                      type="number"
                      value={form.total_freight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          total_freight: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Shipment Mode
                    </label>

                    <select
                      value={form.shipment_mode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipment_mode: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                      required
                    >
                      <option value="">Select Shipment Mode</option>

                      <option value="Road Freight">Road Freight</option>

                      <option value="Air Freight">Air Freight</option>

                      <option value="Sea Freight">Sea Freight</option>

                      <option value="Rail Freight">Rail Freight</option>

                      <option value="Express Delivery">Express Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Carrier</label>

                    <select
                      value={form.carrier}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          carrier: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
                      required
                    >
                      <option value="">Select Carrier</option>

                      <option value="DHL">DHL</option>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="EMS">EMS</option>
                      <option value="CMA CGM">CMA CGM</option>
                      <option value="Maersk">Maersk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Carrier Number
                    </label>

                    <input
                      type="text"
                      value={form.carrier_number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          carrier_number: e.target.value,
                        })
                      }
                      className="w-full p-4 border rounded-lg"
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

                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
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

                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
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

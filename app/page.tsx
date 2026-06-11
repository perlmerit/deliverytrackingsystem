"use client";

import { useState } from "react";
import LoginModal from "./components/LoginModal";

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-950 flex items-center justify-center px-10">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 items-center">
       

        <div>
          <div className="inline-block bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full mb-6">
            Logistics Management Platform
          </div>

          <h1 className="text-6xl font-extrabold text-white leading-tight">
            Logistics Delivery
            <span className="block text-blue-400">Tracking System</span>
          </h1>

          <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-xl">
            Manage package deliveries, monitor shipment status, and allow
            customers to track their deliveries using unique tracking numbers.
          </p>

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
              Login
            </button>

           
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <h2 className="text-3xl font-bold text-white">100+</h2>
              <p className="text-gray-400">Deliveries Managed</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">24/7</h2>
              <p className="text-gray-400">Tracking Access</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">Secure</h2>
              <p className="text-gray-400">Authentication</p>
            </div>
          </div>
        </div>

        

        <div className="hidden md:flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-[450px] shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-8">
              System Features
            </h2>

            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-white font-semibold">Dashboard</h3>

                <p className="text-gray-300 text-sm">
                  Monitor total deliveries, pending shipments, and delivered
                  packages.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-white font-semibold">
                  Delivery Management
                </h3>

                <p className="text-gray-300 text-sm">
                  Add, edit, view and delete delivery records.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-white font-semibold">Tracking System</h3>

                <p className="text-gray-300 text-sm">
                  Customers can track packages using tracking numbers.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-white font-semibold">Reports</h3>

                <p className="text-gray-300 text-sm">
                  Generate logistics summaries and delivery statistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal isVisible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Page;

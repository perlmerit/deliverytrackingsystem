"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "../components/Sidebar";
import Wrapper from "../components/Wrapper";

const Dashboard = () => {
  const [total, setTotal] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [pending, setPending] = useState(0);
  const [inTransit, setInTransit] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setTotal(data.length);

    setDelivered(
      data.filter(
        (delivery) => delivery.status === "Delivered"
      ).length
    );

    setPending(
      data.filter(
        (delivery) => delivery.status === "Pending"
      ).length
    );

    setInTransit(
      data.filter(
        (delivery) => delivery.status === "In Transit"
      ).length
    );
  }

  return (
    <Wrapper>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">
            Dashboard
          </h1>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Total Deliveries */}
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-500 p-10 h-[250px] flex flex-col justify-center">
              <h2 className="text-2xl text-gray-600 font-medium">
                Total Deliveries
              </h2>

              <p className="text-7xl font-bold text-blue-600 mt-4">
                {total}
              </p>
            </div>

            {/* Delivered */}
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-green-500 p-10 h-[250px] flex flex-col justify-center">
              <h2 className="text-2xl text-gray-600 font-medium">
                Delivered
              </h2>

              <p className="text-7xl font-bold text-green-600 mt-4">
                {delivered}
              </p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-red-500 p-10 h-[250px] flex flex-col justify-center">
              <h2 className="text-2xl text-gray-600 font-medium">
                Pending
              </h2>

              <p className="text-7xl font-bold text-red-600 mt-4">
                {pending}
              </p>
            </div>

            {/* In Transit */}
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-yellow-500 p-10 h-[250px] flex flex-col justify-center">
              <h2 className="text-2xl text-gray-600 font-medium">
                In Transit
              </h2>

              <p className="text-7xl font-bold text-yellow-500 mt-4">
                {inTransit}
              </p>
            </div>

          </div>
        </main>
      </div>
    </Wrapper>
  );
};

export default Dashboard;
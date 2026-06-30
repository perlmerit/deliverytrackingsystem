"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";
import ShipmentModeChart from "@/app/components/ShipmentModeChart";
import CarrierChart from "@/app/components/CarrierChart";
import WarehouseChart from "@/app/components/WarehouseChart";
import MonthlyShipmentChart from "@/app/components/MonthlyShipmentChart";

export default function ReportsPage() {

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    returned: 0,
  });

  const [shipmentModeData, setShipmentModeData] = useState<
    { name: string; total: number }[]
  >([]);
  
  const [carrierData, setCarrierData] = useState<
    { name: string; total: number }[]
  >([]);

  const [warehouseData, setWarehouseData] = useState<
    { name: string; total: number }[]
  >([]);

  const [monthlyData, setMonthlyData] = useState<
    { month: string; total: number }[]
  >([]);

  const [filter, setFilter] = useState("Today");

useEffect(() => {
  fetchReports();
  fetchShipmentModes();
  fetchCarrierPerformance();
  fetchWarehousePerformance();
  fetchMonthlyTrends();
}, []);

  async function fetchReports() {
    const { data, error } = await supabase.from("deliveries").select("status");

    if (error) {
      console.log(error);
      return;
    }

    const total = data.length;

    const pending = data.filter(
      (d) =>
        d.status === "Package Received" || d.status === "Received at Warehouse",
    ).length;

    const inTransit = data.filter(
      (d) =>
        d.status === "Loaded onto Truck" ||
        d.status === "Received by Driver" ||
        d.status === "In Transit" ||
        d.status === "Arrived at Branch" ||
        d.status === "Out for Delivery",
    ).length;

    const delivered = data.filter((d) => d.status === "Delivered").length;

    const returned = data.filter((d) => d.status === "Returned").length;

    setStats({
      total,
      pending,
      inTransit,
      delivered,
      returned,
    });
  }

  async function fetchShipmentModes() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("shipment_mode");

    if (error) {
      console.log(error);
      return;
    }

    const counts: Record<string, number> = {};

    data.forEach((item) => {
      if (!counts[item.shipment_mode]) {
        counts[item.shipment_mode] = 0;
      }

      counts[item.shipment_mode]++;
    });

    const chartData = Object.keys(counts).map((key) => ({
      name: key,
      total: counts[key],
    }));

    setShipmentModeData(chartData);
  }

  async function fetchCarrierPerformance() {
    const { data, error } = await supabase.from("deliveries").select("carrier");

    if (error) {
      console.log(error);
      return;
    }

    const counts: Record<string, number> = {};

    data.forEach((item) => {
      if (!counts[item.carrier]) {
        counts[item.carrier] = 0;
      }

      counts[item.carrier]++;
    });

    const chartData = Object.keys(counts).map((key) => ({
      name: key,
      total: counts[key],
    }));

    setCarrierData(chartData);
  }

  async function fetchWarehousePerformance() {
    const { data, error } = await supabase
      .from("tracking_history")
      .select("location");

    if (error) {
      console.log(error);
      return;
    }

    const counts: Record<string, number> = {};

    data.forEach((item) => {
      if (!counts[item.location]) {
        counts[item.location] = 0;
      }

      counts[item.location]++;
    });

    const chartData = Object.keys(counts).map((key) => ({
      name: key,
      total: counts[key],
    }));

    setWarehouseData(chartData);
  }

  async function fetchMonthlyTrends() {
    const { data, error } = await supabase
      .from("deliveries")
      .select("created_at");

    if (error) {
      console.log(error);
      return;
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const counts: Record<string, number> = {};

    months.forEach((month) => {
      counts[month] = 0;
    });

    data.forEach((item) => {
      const month = months[new Date(item.created_at).getMonth()];
      counts[month]++;
    });

    const chartData = months.map((month) => ({
      month,
      total: counts[month],
    }));

    setMonthlyData(chartData);
  }

  const successRate =
    stats.total === 0 ? 0 : ((stats.delivered / stats.total) * 100).toFixed(1);

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Reports Dashboard</h1>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Date Filter</h2>

            <div className="flex gap-4">
              <button
                onClick={() => setFilter("Today")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "Today" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Today
              </button>

              <button
                onClick={() => setFilter("This Week")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "This Week"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                This Week
              </button>

              <button
                onClick={() => setFilter("This Month")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "This Month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                This Month
              </button>
            </div>

            <p className="mt-4 text-gray-600">
              Current Filter:
              <strong> {filter}</strong>
            </p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-500">Total Shipments</h3>
              <p className="text-4xl font-bold mt-2">{stats.total}</p>
            </div>

            <div className="bg-yellow-100 rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600">Pending</h3>
              <p className="text-4xl font-bold mt-2">{stats.pending}</p>
            </div>

            <div className="bg-blue-100 rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600">In Transit</h3>
              <p className="text-4xl font-bold mt-2">{stats.inTransit}</p>
            </div>

            <div className="bg-green-100 rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600">Delivered</h3>
              <p className="text-4xl font-bold mt-2">{stats.delivered}</p>
            </div>

            <div className="bg-red-100 rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600">Returned</h3>
              <p className="text-4xl font-bold mt-2">{stats.returned}</p>
            </div>
          </div>

          {/* Delivery Success Rate */}

          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Delivery Success Rate</h2>

            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ width: `${successRate}%` }}
              >
                {successRate}%
              </div>
            </div>

            <p className="mt-4 text-gray-600">
              Percentage of shipments successfully delivered.
            </p>
          </div>

          {/* Shipment Mode Chart */}

          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">
              Shipment Mode Distribution
            </h2>

            <ShipmentModeChart data={shipmentModeData} />
          </div>

          {/* Carrier Performance */}

          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Carrier Performance</h2>

            <CarrierChart data={carrierData} />
          </div>

          {/* Warehouse Performance */}

          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Warehouse Performance</h2>

            <WarehouseChart data={warehouseData} />
          </div>

          {/* Monthly Shipment Trends */}

          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Monthly Shipment Trends</h2>

            <MonthlyShipmentChart data={monthlyData} />
          </div>
        </main>
      </div>
    </Wrapper>
  );
}

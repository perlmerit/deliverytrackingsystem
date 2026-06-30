"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
      alert("Logout failed");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-slate-900 text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-10">Logistics Tracker</h1>

      <nav className="flex flex-col gap-2 mt-6">
        <Link
          href="/dashboard"
          className={`w-full p-3 rounded-lg transition ${
            pathname === "/dashboard"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/deliveries"
          className={`w-full p-3 rounded-lg transition ${
            pathname.startsWith("/deliveries")
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Deliveries
        </Link>

        <Link
          href="/tracking"
          className={`w-full p-3 rounded-lg transition ${
            pathname === "/tracking"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Tracking
        </Link>

        <Link
          href="/tracking-history"
          className={`w-full p-3 rounded-lg transition ${
            pathname === "/tracking-history"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Tracking History
        </Link>

        <Link
          href="/proof-of-delivery"
          className={`w-full p-3 rounded-lg transition ${
            pathname === "/proof-of-delivery"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Proof Of Delivery
        </Link>

       

        <Link
          href="/warehouse-movements"
          className={`w-full p-3 rounded-lg transition ${
            pathname === "/warehouse-movements"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Warehouse Movements
        </Link>

        <Link
          href="/reports"
          className={`w-full p-3 rounded-lg transition ${
            pathname === "/reports"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Reports
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg bg-red-600 hover:bg-red-700 mt-4"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

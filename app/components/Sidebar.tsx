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
    <div className="w-64 h-screen fixed left-0 top-0 bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Logistics Tracker</h1>

      <nav className="space-y-3">
        <Link
          href="/dashboard"
          className={`block p-3 rounded-lg transition-all duration-200 ${
            pathname === "/dashboard"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/deliveries"
          className={`block p-3 rounded-lg transition-all duration-200 ${
            pathname.startsWith("/deliveries")
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Deliveries
        </Link>

        <Link
          href="/tracking"
          className={`block p-3 rounded-lg transition-all duration-200 ${
            pathname === "/tracking"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Tracking
        </Link>

        <Link
          href="/reports"
          className={`block p-3 rounded-lg transition-all duration-200 ${
            pathname === "/reports"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Reports
        </Link>

        <Link
          href="/tracking-history"
          className={`block p-3 rounded-lg transition-all duration-200 ${
            pathname === "/tracking"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-700"
          }`}
        >
          Tracking History
        </Link>

        <Link
          href="/proof-of-delivery"
          className="block p-3 hover:bg-blue-800 rounded"
        >
          Proof Of Delivery
        </Link>

        <Link href="/gps-navigation" 
        className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
          
            GPS Navigation
          
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg bg-red-600 hover:bg-red-700 mt-10"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

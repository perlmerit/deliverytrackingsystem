"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
import Wrapper from "@/app/components/Wrapper";

interface WarehouseMovement {
  id: number;
  movement_type: string;
  notes: string;
  created_at: string;

  deliveries?: {
    tracking_number: string;
  };

  warehouses?: {
    warehouse_name: string;
    city: string;
  };
}

export default function WarehouseMovementsPage() {
  const [movements, setMovements] = useState<WarehouseMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
  }, []);

  async function fetchMovements() {
    const { data, error } = await supabase
      .from("warehouse_movements")
      .select(
        `
        *,
        deliveries (
          tracking_number
        ),
        warehouses (
          warehouse_name,
          city
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setMovements(data || []);
    setLoading(false);
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <h1 className="text-4xl font-bold mb-8">Warehouse Movements</h1>

          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : movements.length === 0 ? (
              <p>No warehouse movements found.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left">Tracking Number</th>
                    <th className="p-4 text-left">Warehouse</th>
                    <th className="p-4 text-left">City</th>
                    <th className="p-4 text-left">Movement Type</th>
                    <th className="p-4 text-left">Notes</th>
                    <th className="p-4 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id} className="border-t">
                      <td className="p-4">
                        {movement.deliveries?.tracking_number}
                      </td>

                      <td className="p-4">
                        {movement.warehouses?.warehouse_name}
                      </td>

                      <td className="p-4">{movement.warehouses?.city}</td>

                      <td className="p-4">{movement.movement_type}</td>

                      <td className="p-4">{movement.notes}</td>

                      <td className="p-4">
                        {new Date(movement.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </Wrapper>
  );
}

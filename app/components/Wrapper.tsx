"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(!!session);
      setLoading(false);
    }

    getSession();
  }, []);

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/");
    }
  }, [loading, authenticated, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return null;
}

export default Wrapper;

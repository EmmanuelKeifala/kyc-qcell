"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          router.push("/?admin=true");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        router.push("/?admin=true");
      }
    };

    getUserSession();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full h-full justify-center items-center">
        <Loader />;
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

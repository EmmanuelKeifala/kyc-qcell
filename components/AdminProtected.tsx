import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import Loader from "./Loader";

const AdminLoginModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (path) {
      setOpen(true);
    }
  }, [path]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please enter both email and password", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
      router.push("/admin");

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      toast.error("Invalid email or password", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
      router.push("/admin");

      return;
    }

    const { data: session } = await supabase.auth.getSession();
    console.log(session);

    toast.success("Login was successful", {
      position: "top-center",
      autoClose: 5000,
    });
    setLoading(false);
    setOpen(false);
    router.push("/admin");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <X
              size={30}
              onClick={closeModal}
              className="cursor-pointer text-[#8d5f2e]"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter your credentials.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2"
              required
            />
          </div>

          <AlertDialogFooter>
            {!loading ? (
              <AlertDialogAction
                type="submit"
                className="w-full bg-[#8d5f2e] hover:bg-[#aa8e6f]"
              >
                Login
              </AlertDialogAction>
            ) : (
              <Loader />
            )}
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminLoginModal;

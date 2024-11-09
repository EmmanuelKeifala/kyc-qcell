"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
type Props = {};
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Nav = (props: Props) => {
  const [userData, setUserData] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUserData(data?.session?.user as any);
    };
    getUserData();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();

      toast.success("Signed out successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <header className="bg-transparent p-2 flex justify-end items-center">
      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-2 py-1.5 h-auto "
            >
              <div className="flex items-center gap-3">
                {/* <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="JDK" />
                  <AvatarFallback className="text-black">JDK</AvatarFallback>
                </Avatar> */}
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">
                    {userData?.user_metadata?.name || userData?.email}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-black" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Nav;

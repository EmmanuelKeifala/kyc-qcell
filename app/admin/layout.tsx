// import Navbar from "@/components/Navbar";
import AdminProtected from "@/components/AdminProtected";
import Menu from "@/components/Menu";
import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProtected>
      <div className="h-screen flex overflow-hidden">
        {/* LEFT (Sidebar) */}
        <div className="w-[18%] md:w-[10%] lg:w-[19%] xl:w-[18%] p-4 flex-shrink-0 overflow-y-auto scrollbar-hide bg-[#dacbbc]">
          <Link
            href={"/"}
            className="flex flex-col items-center gap-2 justify-center lg:justify-start"
          >
            <Image
              src="/logo.jpg"
              width={100}
              height={100}
              alt="Qcell Logo"
              className="w-[30%] h-[30%]"
            />
          </Link>

          <Menu />
        </div>

        <div className="flex-1 flex flex-col bg-white overflow-hidden scrollbar-hide">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <Nav />
            {children}
          </div>
        </div>
        <ToastContainer />
      </div>
    </AdminProtected>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon?: LucideIcon;
  label: string;
  href: string;
  imgSrc?: any;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  imgSrc,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        " rounded-r-lg flex items-center justify-center lg:justify-normal px-2  text-gray-700 text-sm font-[500] transition-all  hover:bg-[#7aacac0d]",
        isActive && " border-l-4 border-bgPrimary text-bgPrimary bg-[#0080800D]"
      )}
    >
      <div className="flex items-center gap-x-4 py-4 ">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {Icon ? (
            <Icon
              size={30}
              className={cn("text-black", isActive && "text-[#F78F1E]")}
            />
          ) : (
            <Image
              src={imgSrc}
              width={28}
              height={28}
              alt={imgSrc}
              className={`${isActive && "text-[#F78F1E]"}`}
            />
          )}
        </div>
        <p className="hidden lg:block text-left font-Mons font-semibold text-lg">
          {label}
        </p>
      </div>
    </button>
  );
};

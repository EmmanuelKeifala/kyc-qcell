"use client";
import {
  LayoutDashboard,
  List,
  Network,
  Settings,
  UsersRound,
  ShieldAlert,
  Users,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
const menuItems = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        visible: ["admin"],
      },
      {
        label: "Flagged Users",
        href: "/admin/flagged-users",
        icon: ShieldAlert,
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings",
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm SS">
      {menuItems.map((section, index) => (
        <div className="flex flex-col gap-2" key={index - index}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;

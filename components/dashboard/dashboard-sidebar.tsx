"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings, LogOut, Home, CalendarDays } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons";
import { signOut } from "@/lib/auth-client";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Schedules",
    href: "/dashboard/schedules",
    icon: CalendarDays,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        {...props}
        className="!bg-[#155E63] border-r-0"
      >
        <SidebarHeader className="p-4 border-b border-white/10 group-data-[collapsible=icon]:px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
          >
            <div className="w-9 h-9 rounded-full bg-[#6CBF6D] flex items-center justify-center flex-shrink-0">
              <LogoIcon className="w-5 h-5" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-rg-standard-book font-semibold text-sm text-white leading-tight">
                Afrique Bitcoin
              </h2>
              <p className="text-xs text-[#6CBF6D]">Admin Portal</p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarMenu className="gap-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-2.5 py-2 rounded-md transition-all duration-200 w-full
                      group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0
                      ${
                        isActive
                          ? "bg-[#6CBF6D] text-[#155E63] font-medium"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarSeparator className="!bg-white/10" />

        <SidebarFooter className="px-2 py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center gap-3 px-2.5 py-2 rounded-md w-full text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">
                  Logout
                </span>
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[#155E63] flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-[#337875]">
              Are you sure you want to log out of the admin portal? You will
              need to sign in again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-[#155E63] hover:bg-[#0f4a4e] text-white"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-[#e5e5e0] h-[var(--header-height)] flex items-center px-4 gap-4">
      <SidebarTrigger className="-ml-1 text-[#155E63] hover:bg-[#155E63]/10" />
      <Separator orientation="vertical" className="h-6 bg-[#e5e5e0]" />
      <div className="flex-1">
        <h1 className="font-rg-standard-book text-lg font-semibold text-[#155E63]">
          Admin Dashboard
        </h1>
      </div>
      {session?.user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-[#155E63]">
              {session.user.name || "Admin"}
            </p>
            <p className="text-xs text-[#337875]">{session.user.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#155E63] to-[#0f4a4e] flex items-center justify-center text-white text-sm font-medium shadow-sm">
            {session.user.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      )}
    </header>
  );
}

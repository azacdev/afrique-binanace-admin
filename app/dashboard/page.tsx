"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, Users, ArrowRight } from "lucide-react";

interface DashboardStats {
  totalSchedules: number;
  activeSchedules: number;
  upcomingSessions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSchedules: 0,
    activeSchedules: 0,
    upcomingSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/schedules");
        if (response.ok) {
          const data = await response.json();
          const schedules = data.schedules || [];
          setStats({
            totalSchedules: schedules.length,
            activeSchedules: schedules.filter(
              (s: { isActive: boolean }) => s.isActive,
            ).length,
            upcomingSessions: schedules.length,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Schedules",
      value: stats.totalSchedules,
      icon: Calendar,
      gradient: "from-[#155E63] to-[#0f4a4e]",
      iconBg: "bg-white/20",
    },
    {
      title: "Active Schedules",
      value: stats.activeSchedules,
      icon: CalendarDays,
      gradient: "from-[#6CBF6D] to-[#4aa84a]",
      iconBg: "bg-white/20",
    },
    {
      title: "Published",
      value: stats.upcomingSessions,
      icon: Users,
      gradient: "from-[#337875] to-[#155E63]",
      iconBg: "bg-white/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="font-rg-standard-book text-3xl font-bold text-[#155E63]">
          Dashboard
        </h1>
        <p className="text-[#337875] mt-1">
          Welcome to the Afrique Bitcoin Conference Admin Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-lg overflow-hidden`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {loading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border border-[#e5e5e0] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-rg-standard-book text-[#155E63] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Manage Schedules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-[#337875] text-sm">
              Create, edit, and organize conference schedules. Add speakers, set
              times, and manage the schedule.
            </p>
            <Link
              href="/dashboard/schedules"
              className="inline-flex items-center gap-2 text-[#155E63] font-medium text-sm hover:text-[#0f4a4e] transition-colors"
            >
              Go to Schedules
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#e5e5e0] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="font-rg-standard-book text-[#155E63] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-[#337875] text-sm">
              Invite new administrators to help manage the conference portal.
              Control access and permissions.
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 text-[#155E63] font-medium text-sm hover:text-[#0f4a4e] transition-colors"
            >
              Go to Settings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

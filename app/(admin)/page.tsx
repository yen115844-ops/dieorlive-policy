"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import {
    Activity,
    AlertTriangle,
    CalendarCheck,
    Clock,
    RefreshCw,
    Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalCheckIns: number;
  todayCheckIns: number;
  pendingAlerts: number;
  recentCheckIns: any[];
  recentUsers: any[];
  checkInsTrend?: any[];
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`rounded-lg p-2 ${iconColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-xl font-bold sm:text-2xl">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getDashboardStats();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Tổng quan về hệ thống Die or Live
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 sm:size-default" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Lỗi: {error}</p>
            <Button variant="outline" className="mt-2" onClick={fetchData}>
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng người dùng"
          value={data?.totalUsers ?? 0}
          icon={Users}
          iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
          loading={loading}
        />
        <StatCard
          title="Người dùng hoạt động"
          value={data?.activeUsers ?? 0}
          icon={Activity}
          iconColor="bg-gradient-to-br from-green-500 to-green-600"
          loading={loading}
        />
        <StatCard
          title="Check-in hôm nay"
          value={data?.todayCheckIns ?? 0}
          icon={CalendarCheck}
          iconColor="bg-gradient-to-br from-rose-500 to-pink-600"
          loading={loading}
        />
        <StatCard
          title="Cảnh báo chờ xử lý"
          value={data?.pendingAlerts ?? 0}
          icon={AlertTriangle}
          iconColor="bg-gradient-to-br from-amber-500 to-orange-600"
          loading={loading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-7 lg:gap-6">
        {/* Recent Check-ins */}
        <Card className="min-w-0 lg:col-span-4">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">Check-in gần đây</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Danh sách người dùng đã check-in gần đây
              </CardDescription>
            </div>
            <Link href="/checkins" className="shrink-0">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Xem tất cả
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-6">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.recentCheckIns?.slice(0, 5).map((checkIn) => (
                    <TableRow key={checkIn.id}>
                      <TableCell className="font-medium">
                        <Link href={`/users/${checkIn.user_id}`} className="hover:underline">
                          {checkIn.user_name || checkIn.user_email}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(checkIn.check_in_time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          🔥 {checkIn.streak || 1} ngày
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!data?.recentCheckIns || data.recentCheckIns.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Chưa có check-in nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="min-w-0 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Thống kê tổng quan</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Số liệu tổng hợp hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Tổng check-in</p>
                  <p className="text-xs text-muted-foreground">Từ trước đến nay</p>
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className="font-bold">{data?.totalCheckIns?.toLocaleString() ?? 0}</span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Tỷ lệ hoạt động</p>
                  <p className="text-xs text-muted-foreground">Người dùng active/tổng</p>
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className="font-bold">
                  {data?.totalUsers
                    ? `${Math.round((data.activeUsers / data.totalUsers) * 100)}%`
                    : "0%"}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-rose-100 p-2 dark:bg-rose-900">
                  <CalendarCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Check-in hôm nay</p>
                  <p className="text-xs text-muted-foreground">Tỷ lệ so với active users</p>
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className="font-bold">
                  {data?.activeUsers
                    ? `${Math.round((data.todayCheckIns / data.activeUsers) * 100)}%`
                    : "0%"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Người dùng mới</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Những người dùng đăng ký gần đây</CardDescription>
          </div>
          <Link href="/users" className="shrink-0">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Xem tất cả
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Thời gian đăng ký</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs">
                            {user.full_name
                              ? user.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                              : user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {user.full_name || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTimeAgo(user.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/users/${user.id}`}>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.recentUsers || data.recentUsers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Chưa có người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

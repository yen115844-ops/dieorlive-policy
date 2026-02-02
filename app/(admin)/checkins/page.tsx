"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    Calendar,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    RefreshCw,
    Search,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface CheckIn {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  check_in_date: string;
  check_in_time: string;
  note: string | null;
  streak: number;
}

interface CheckInStats {
  total: number;
  today: number;
  averageTime: string;
}

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = React.useState<CheckIn[]>([]);
  const [stats, setStats] = React.useState<CheckInStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [availableDates, setAvailableDates] = React.useState<string[]>([]);
  const itemsPerPage = 10;

  const fetchCheckIns = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getCheckIns({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        date: dateFilter !== "all" ? dateFilter : undefined,
      });
      setCheckIns(result.checkIns);
      setTotalCount(result.total);
      setStats(result.stats);
      
      // Get unique dates for filter
      if (result.availableDates) {
        setAvailableDates(result.availableDates);
      }
    } catch (error) {
      console.error("Fetch check-ins error:", error);
      toast.error("Không thể tải dữ liệu check-in");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, dateFilter]);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCheckIns();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchCheckIns]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    }
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeStr: string) => {
    return timeStr?.slice(0, 5) || "—";
  };

  if (loading && checkIns.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-16" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Lịch sử Check-in</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Xem tất cả check-in của người dùng trong hệ thống
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" className="sm:size-default" onClick={fetchCheckIns}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm" className="w-fit sm:size-default" asChild>
            <a href={api.getExportCheckInsUrl({ dateFrom: dateFilter !== "all" ? dateFilter : undefined })} download>
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 p-3">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
                <p className="text-sm text-muted-foreground">Tổng check-in</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.today ?? 0}</p>
                <p className="text-sm text-muted-foreground">Hôm nay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.averageTime ?? "—"}</p>
                <p className="text-sm text-muted-foreground">Giờ TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select 
              value={dateFilter} 
              onValueChange={(value) => {
                setDateFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chọn ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngày</SelectItem>
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Check-ins Table */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Danh sách check-in</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Tổng cộng {totalCount} lượt check-in
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkIns.map((checkIn) => (
                <TableRow key={checkIn.id}>
                  <TableCell>
                    <Link href={`/users/${checkIn.user_id}`}>
                      <div className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs">
                            {checkIn.user_name
                              ? checkIn.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                              : checkIn.user_email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{checkIn.user_name || "Chưa cập nhật"}</p>
                          <p className="text-xs text-muted-foreground">{checkIn.user_email}</p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatDate(checkIn.check_in_date)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(checkIn.check_in_time)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      🔥 {checkIn.streak}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {checkIn.note || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
              {checkIns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy check-in nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm order-2 sm:order-1">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, totalCount)} của{" "}
                {totalCount} kết quả
              </p>
              <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
    AlertTriangle,
    Bell,
    ChevronLeft,
    ChevronRight,
    Filter,
    Mail,
    RefreshCw,
    Search,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface Notification {
  id: number;
  user_id: number;
  user_name: string | null;
  user_email: string;
  type: string;
  message: string;
  sent_at: string;
  is_read: boolean;
}

interface NotificationStats {
  total: number;
  reminder: number;
  warning: number;
  emergency: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [stats, setStats] = React.useState<NotificationStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const itemsPerPage = 10;

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getNotificationLogs({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
      setNotifications(result.logs);
      setTotalCount(result.total);
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
      toast.error("Không thể tải dữ liệu thông báo");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, typeFilter]);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      fetchNotifications();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchNotifications]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "reminder":
        return <Badge variant="secondary" className="gap-1"><Bell className="h-3 w-3" /> Nhắc nhở</Badge>;
      case "warning":
        return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-500"><AlertTriangle className="h-3 w-3" /> Cảnh báo</Badge>;
      case "emergency_email":
        return <Badge variant="destructive" className="gap-1"><Mail className="h-3 w-3" /> Khẩn cấp</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-16" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhật ký thông báo</h1>
          <p className="text-muted-foreground">
            Xem lịch sử tất cả thông báo đã gửi trong hệ thống
          </p>
        </div>
        <Button variant="outline" onClick={fetchNotifications}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
                <p className="text-sm text-muted-foreground">Tổng cộng</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 p-3">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.reminder ?? 0}</p>
                <p className="text-sm text-muted-foreground">Nhắc nhở</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.warning ?? 0}</p>
                <p className="text-sm text-muted-foreground">Cảnh báo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-red-500 to-rose-600 p-3">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.emergency ?? 0}</p>
                <p className="text-sm text-muted-foreground">Email khẩn cấp</p>
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
                placeholder="Tìm theo tên, email hoặc nội dung..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select 
              value={typeFilter} 
              onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="reminder">Nhắc nhở</SelectItem>
                <SelectItem value="warning">Cảnh báo</SelectItem>
                <SelectItem value="emergency_email">Email khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thông báo</CardTitle>
          <CardDescription>
            Tổng cộng {totalCount} thông báo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell>
                    <Link href={`/users/${notif.user_id}`}>
                      <div className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs">
                            {notif.user_name
                              ? notif.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                              : notif.user_email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{notif.user_name || "Chưa cập nhật"}</p>
                          <p className="text-xs text-muted-foreground">{notif.user_email}</p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(notif.type)}
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <p className="truncate">{notif.message}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(notif.sent_at)}
                  </TableCell>
                  <TableCell>
                    {notif.is_read ? (
                      <Badge variant="secondary">Đã đọc</Badge>
                    ) : (
                      <Badge variant="default">Chưa đọc</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {notifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Không có thông báo nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, totalCount)} của{" "}
                {totalCount} kết quả
              </p>
              <div className="flex items-center gap-2">
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

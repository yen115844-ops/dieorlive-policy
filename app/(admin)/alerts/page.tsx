"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    Mail,
    RefreshCw,
    Search,
    Send,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface Alert {
  id: number;
  user_id: number;
  user_name: string | null;
  user_email: string;
  contact_name: string;
  contact_email: string;
  contact_relationship: string | null;
  days_missed: number;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

interface AlertStats {
  total: number;
  pending: number;
  sent: number;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [stats, setStats] = React.useState<AlertStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [sendingId, setSendingId] = React.useState<number | null>(null);
  const itemsPerPage = 10;

  const fetchAlerts = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getEmergencyAlerts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? (statusFilter as "pending" | "sent") : undefined,
      });
      setAlerts(result.alerts);
      setTotalCount(result.total);
      setStats(result.stats);
    } catch (error) {
      console.error("Fetch alerts error:", error);
      toast.error("Không thể tải dữ liệu cảnh báo");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      fetchAlerts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchAlerts]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const handleSendAlert = async (alert: Alert) => {
    try {
      setSendingId(alert.id);
      await api.sendEmergencyAlert(alert.user_id, alert.contact_email);
      toast.success("Đã gửi email thông báo khẩn cấp thành công!");
      fetchAlerts();
    } catch (error) {
      console.error("Send alert error:", error);
      toast.error("Không thể gửi email thông báo");
    } finally {
      setSendingId(null);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cảnh báo khẩn cấp</h1>
          <p className="text-muted-foreground">
            Quản lý và gửi thông báo khi người dùng không check-in
          </p>
        </div>
        <Button variant="outline" onClick={fetchAlerts}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-3">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
                <p className="text-sm text-muted-foreground">Tổng cảnh báo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-red-500 to-rose-600 p-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pending ?? 0}</p>
                <p className="text-sm text-muted-foreground">Chờ gửi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.sent ?? 0}</p>
                <p className="text-sm text-muted-foreground">Đã gửi</p>
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
                placeholder="Tìm theo tên người dùng hoặc người thân..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ gửi</SelectItem>
                <SelectItem value="sent">Đã gửi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách cảnh báo</CardTitle>
          <CardDescription>
            Tổng cộng {totalCount} cảnh báo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Số ngày bỏ lỡ</TableHead>
                <TableHead>Người thân</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Link href={`/users/${alert.user_id}`}>
                      <div className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs">
                            {alert.user_name
                              ? alert.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                              : alert.user_email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{alert.user_name || "Chưa cập nhật"}</p>
                          <p className="text-xs text-muted-foreground">{alert.user_email}</p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="font-mono">
                      {alert.days_missed} ngày
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.contact_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.contact_relationship || "Người thân"} • {alert.contact_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alert.email_sent ? (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Đã gửi
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Chờ gửi
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {alert.email_sent ? (
                      <div>
                        <p>Gửi: {formatDateTime(alert.email_sent_at)}</p>
                      </div>
                    ) : (
                      <p>Tạo: {formatDateTime(alert.created_at)}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!alert.email_sent && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Send className="mr-2 h-3 w-3" />
                            Gửi ngay
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Xác nhận gửi cảnh báo</DialogTitle>
                            <DialogDescription>
                              Bạn có chắc muốn gửi email thông báo khẩn cấp đến{" "}
                              <span className="font-medium">{alert.contact_name}</span> về tình trạng của{" "}
                              <span className="font-medium">{alert.user_name || alert.user_email}</span>?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="rounded-lg border p-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Người nhận:</span> {alert.contact_email}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Nội dung:</span> Thông báo {alert.user_name || alert.user_email} đã không check-in trong {alert.days_missed} ngày.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Hủy</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleSendAlert(alert)}
                              disabled={sendingId === alert.id}
                            >
                              {sendingId === alert.id ? (
                                <>Đang gửi...</>
                              ) : (
                                <>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Gửi email
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không có cảnh báo nào
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

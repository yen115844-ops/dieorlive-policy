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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Bell,
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    Mail,
    RefreshCw,
    Search,
    Send,
    Users,
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

interface UserOption {
  id: number;
  email: string;
  full_name: string | null;
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

  // FCM send form
  const [fcmTitle, setFcmTitle] = React.useState("");
  const [fcmBody, setFcmBody] = React.useState("");
  const [sendToAll, setSendToAll] = React.useState(false);
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
  const [fcmSending, setFcmSending] = React.useState(false);
  const [usersForSelect, setUsersForSelect] = React.useState<UserOption[]>([]);
  const [usersSelectLoading, setUsersSelectLoading] = React.useState(false);
  const [selectRecipientsOpen, setSelectRecipientsOpen] = React.useState(false);

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

  const loadUsersForSelect = React.useCallback(async () => {
    try {
      setUsersSelectLoading(true);
      const result = await api.getUsers({ limit: 200, status: "active" });
      setUsersForSelect(result.users);
    } catch (e) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setUsersSelectLoading(false);
    }
  }, []);

  const toggleUserSelection = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSendFcm = async () => {
    const title = fcmTitle.trim();
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề thông báo");
      return;
    }
    if (!sendToAll && selectedUserIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người nhận hoặc bật 'Gửi cho tất cả'");
      return;
    }
    try {
      setFcmSending(true);
      const result = await api.sendFcmNotification({
        title,
        body: fcmBody.trim() || undefined,
        sendToAll: sendToAll || undefined,
        userIds: sendToAll ? undefined : selectedUserIds,
      });
      if (result.success) {
        toast.success(result.message);
        setFcmTitle("");
        setFcmBody("");
        setSelectedUserIds([]);
        fetchNotifications();
      } else {
        toast.error(result.message || "Gửi thất bại");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gửi thông báo FCM thất bại");
    } finally {
      setFcmSending(false);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "reminder":
        return <Badge variant="secondary" className="gap-1"><Bell className="h-3 w-3" /> Nhắc nhở</Badge>;
      case "warning":
        return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-500"><AlertTriangle className="h-3 w-3" /> Cảnh báo</Badge>;
      case "emergency_email":
        return <Badge variant="destructive" className="gap-1"><Mail className="h-3 w-3" /> Khẩn cấp</Badge>;
      case "admin_fcm":
        return <Badge variant="outline" className="gap-1 border-blue-500 text-blue-600 dark:text-blue-400"><Send className="h-3 w-3" /> Admin FCM</Badge>;
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
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Nhật ký thông báo</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Xem lịch sử tất cả thông báo đã gửi trong hệ thống
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 sm:size-default" onClick={fetchNotifications}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-4">
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

      {/* Gửi thông báo FCM */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Send className="h-5 w-5" />
            Gửi thông báo FCM
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Gửi thông báo đẩy (push) đến 1 hoặc nhiều người dùng qua Firebase Cloud Messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fcm-title">Tiêu đề <span className="text-destructive">*</span></Label>
            <Input
              id="fcm-title"
              placeholder="Ví dụ: Nhắc nhở điểm danh"
              value={fcmTitle}
              onChange={(e) => setFcmTitle(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fcm-body">Nội dung (tùy chọn)</Label>
            <textarea
              id="fcm-body"
              placeholder="Nội dung thông báo hiển thị trên thiết bị"
              value={fcmBody}
              onChange={(e) => setFcmBody(e.target.value)}
              className="flex min-h-[80px] w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="send-to-all"
                checked={sendToAll}
                onCheckedChange={setSendToAll}
              />
              <Label htmlFor="send-to-all" className="cursor-pointer">
                Gửi cho tất cả người dùng có FCM token
              </Label>
            </div>
            {!sendToAll && (
              <Dialog open={selectRecipientsOpen} onOpenChange={(open) => {
                setSelectRecipientsOpen(open);
                if (open) loadUsersForSelect();
              }}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Chọn người nhận {selectedUserIds.length > 0 && `(${selectedUserIds.length})`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] flex flex-col sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Chọn người nhận</DialogTitle>
                    <DialogDescription>
                      Chọn một hoặc nhiều người dùng để gửi thông báo FCM. Chỉ gửi được đến tài khoản có FCM token.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="flex-1 rounded-md border p-2 min-h-[200px] max-h-[300px]">
                    {usersSelectLoading ? (
                      <div className="space-y-2 p-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {usersForSelect.map((u) => {
                          const selected = selectedUserIds.includes(u.id);
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => toggleUserSelection(u.id)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                                selected && "bg-primary/10"
                              )}
                            >
                              <div className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                                selected ? "bg-primary text-primary-foreground border-primary" : "border-input"
                              )}>
                                {selected ? <Check className="h-3 w-3" /> : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{u.full_name || "Chưa cập nhật"}</p>
                                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                              </div>
                            </button>
                          );
                        })}
                        {usersForSelect.length === 0 && !usersSelectLoading && (
                          <p className="py-4 text-center text-sm text-muted-foreground">Không có người dùng nào</p>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setSelectRecipientsOpen(false)}>
                      Xong
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Button onClick={handleSendFcm} disabled={fcmSending}>
            {fcmSending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Gửi thông báo FCM
              </>
            )}
          </Button>
        </CardContent>
      </Card>

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
                <SelectItem value="admin_fcm">Admin FCM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Danh sách thông báo</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Tổng cộng {totalCount} thông báo
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-6">
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

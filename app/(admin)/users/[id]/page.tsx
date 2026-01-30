"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Mail,
    MoreHorizontal,
    Phone,
    RefreshCw,
    User,
    UserCheck,
    UserX,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface UserDetail {
  id: number;
  email: string;
  full_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  reminder_time_1: string;
  reminder_time_2: string;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  total_check_ins: number;
  last_check_in: string | null;
  current_streak: number;
  days_lived?: number;
  months_lived?: number;
  years_lived?: number;
}

interface Contact {
  id: number;
  name: string;
  relationship: string | null;
  email: string;
  phone: string | null;
  is_primary: boolean;
}

interface CheckIn {
  id: number;
  check_in_date: string;
  check_in_time: string;
  note: string | null;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = React.useState<UserDetail | null>(null);
  const [stats, setStats] = React.useState<UserStats | null>(null);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [checkIns, setCheckIns] = React.useState<CheckIn[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUser = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getUser(parseInt(userId));
      setUser(result.user);
      setStats(result.stats);
      setContacts(result.contacts);
      setCheckIns(result.recentCheckIns);
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleStatusChange = async (isActive: boolean) => {
    try {
      await api.updateUserStatus(parseInt(userId), isActive);
      toast.success(isActive ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản");
      fetchUser();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case "male": return "Nam";
      case "female": return "Nữ";
      case "other": return "Khác";
      default: return "Chưa cập nhật";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "—";
    return timeStr.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Không tìm thấy người dùng</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết người dùng</h1>
          <p className="text-muted-foreground">ID: #{userId}</p>
        </div>
        <Button variant="outline" onClick={fetchUser}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Thao tác
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Gửi email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.is_active ? (
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleStatusChange(false)}
              >
                <UserX className="mr-2 h-4 w-4" />
                Vô hiệu hóa tài khoản
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-green-600"
                onClick={() => handleStatusChange(true)}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Kích hoạt tài khoản
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Profile Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-2xl">
                  {user.full_name
                    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                    : user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{user.full_name || "Chưa cập nhật"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge className="mt-2" variant={user.is_active ? "default" : "secondary"}>
                {user.is_active ? "Đang hoạt động" : "Đã vô hiệu"}
              </Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{getGenderLabel(user.gender)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(user.date_of_birth)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Nhắc nhở: {formatTime(user.reminder_time_1)}, {formatTime(user.reminder_time_2)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Đăng ký: {formatDate(user.created_at)}</p>
              <p>Cập nhật: {formatDate(user.updated_at)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-rose-500">{stats?.total_check_ins ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Tổng check-in</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-500">🔥 {stats?.current_streak ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Streak hiện tại</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">{stats?.years_lived ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">Tuổi</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">{stats?.days_lived?.toLocaleString() ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">Ngày đã sống</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="checkins" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checkins">Lịch sử check-in</TabsTrigger>
              <TabsTrigger value="contacts">Người thân ({contacts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="checkins">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử check-in gần đây</CardTitle>
                  <CardDescription>
                    Check-in gần nhất: {stats?.last_check_in ? formatDate(stats.last_check_in) : "Chưa có"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkIns.map((checkIn) => (
                        <TableRow key={checkIn.id}>
                          <TableCell className="font-medium">
                            {formatDate(checkIn.check_in_date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(checkIn.check_in_time)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {checkIn.note || <span className="text-muted-foreground">—</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                      {checkIns.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            Chưa có check-in nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách người thân</CardTitle>
                  <CardDescription>
                    Những người sẽ nhận thông báo khẩn cấp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Quan hệ</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Điện thoại</TableHead>
                        <TableHead>Vai trò</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.relationship || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                          <TableCell className="text-muted-foreground">{contact.phone || "—"}</TableCell>
                          <TableCell>
                            {contact.is_primary && (
                              <Badge variant="default">Chính</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {contacts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            Chưa có người thân nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

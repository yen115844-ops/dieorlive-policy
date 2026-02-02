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
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Mail,
    MoreHorizontal,
    RefreshCw,
    Search,
    UserCheck,
    UserX,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  full_name: string | null;
  gender: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  total_check_ins: number;
  last_check_in: string | null;
  contacts_count: number;
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const itemsPerPage = 10;

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: statusFilter as 'all' | 'active' | 'inactive',
      });
      setUsers(result.users);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    try {
      await api.updateUserStatus(userId, isActive);
      toast.success(isActive ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản");
      fetchUsers();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case "male": return "Nam";
      case "female": return "Nữ";
      case "other": return "Khác";
      default: return "—";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Quản lý người dùng</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Xem và quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" className="sm:size-default" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Button variant="outline" size="sm" asChild className="sm:size-default">
            <a href={api.getExportUsersUrl()} download>
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </a>
          </Button>
        </div>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã vô hiệu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Danh sách người dùng</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Tổng cộng {total} người dùng
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs">
                            {user.full_name
                              ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                              : user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.full_name || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getGenderLabel(user.gender)}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Hoạt động" : "Vô hiệu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{user.total_check_ins}</span>
                      <span className="text-muted-foreground"> lần</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{user.contacts_count}</span>
                      <span className="text-muted-foreground"> người</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href={`/users/${user.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Gửi email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.is_active ? (
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleStatusChange(user.id, false)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Vô hiệu hóa
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => handleStatusChange(user.id, true)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Kích hoạt
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={async () => {
                              if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.')) {
                                try {
                                  await api.deleteUser(user.id);
                                  toast.success('Đã xóa người dùng thành công');
                                  fetchUsers();
                                } catch (error) {
                                  toast.error('Không thể xóa người dùng');
                                  console.error(error);
                                }
                              }
                            }}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Xóa tài khoản
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm order-2 sm:order-1">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, total)} của {total} kết quả
              </p>
              <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
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
                  disabled={currentPage === totalPages || loading}
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

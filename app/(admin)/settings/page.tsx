"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Clock,
    Database,
    Loader2,
    Mail,
    RefreshCw,
    Save,
    Server,
    Settings,
    Shield,
    XCircle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface SystemInfo {
  adminVersion: string;
  apiVersion: string;
  database: {
    type: string;
    version: string;
    status: string;
    ping: number;
  };
  email: {
    configured: boolean;
    host: string;
    port: string;
  };
  apiUrl: string;
}

interface SettingsData {
  [key: string]: {
    value: string;
    description: string;
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({});
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  
  // Form states
  const [alertDaysThreshold, setAlertDaysThreshold] = useState("2");
  const [reminderTime1, setReminderTime1] = useState("08:00");
  const [reminderTime2, setReminderTime2] = useState("11:00");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = useState(true);
  const [testEmail, setTestEmail] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getSettings();
      
      if (response.settings) {
        setSettings(response.settings);
        setSystemInfo(response.systemInfo);
        
        // Parse settings into form fields
        const s = response.settings;
        if (s.alert_days?.value) setAlertDaysThreshold(s.alert_days.value);
        if (s.default_reminder_time_1?.value) setReminderTime1(s.default_reminder_time_1.value);
        if (s.default_reminder_time_2?.value) setReminderTime2(s.default_reminder_time_2.value);
        if (s.smtp_host?.value) setSmtpHost(s.smtp_host.value);
        if (s.smtp_port?.value) setSmtpPort(s.smtp_port.value);
        if (s.email_from?.value) setSenderEmail(s.email_from.value);
        if (s.email_display_name?.value) setSenderName(s.email_display_name.value);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Không thể tải cài đặt");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToUpdate: Record<string, string> = {
        alert_days: alertDaysThreshold,
        default_reminder_time_1: reminderTime1,
        default_reminder_time_2: reminderTime2,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        email_from: senderEmail,
        email_display_name: senderName,
      };

      const response = await api.updateSettings(settingsToUpdate);
      
      if (response.success) {
        toast.success("Đã lưu cài đặt thành công");
        fetchSettings(); // Refresh data
      } else {
        toast.error("Không thể lưu cài đặt");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTestingConnection(true);
      const response = await api.testDatabaseConnection();
      
      if (response.status === 'connected') {
        toast.success(`Kết nối Database thành công! (${response.ping}ms)`);
      } else {
        toast.error(`Không thể kết nối Database: ${response.error}`);
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Lỗi kiểm tra kết nối");
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error("Vui lòng nhập email test");
      return;
    }
    
    try {
      setTestingEmail(true);
      const response = await api.testEmailConfiguration(testEmail);
      
      if (response.success) {
        toast.success(response.message || "Email test đã được gửi!");
      } else {
        toast.error(`Lỗi gửi email: ${response.error}`);
      }
    } catch (error) {
      console.error("Error testing email:", error);
      toast.error("Lỗi gửi email test");
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cài đặt hệ thống</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Quản lý cấu hình và cài đặt cho ứng dụng Die or Live
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            className="sm:size-default"
            onClick={fetchSettings}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button size="sm" className="sm:size-default" onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu cài đặt
          </Button>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
        {/* Database Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {systemInfo?.database?.status === 'connected' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-600">Đã kết nối</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-600">Mất kết nối</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {systemInfo?.database?.type} - Ping: {systemInfo?.database?.ping}ms
            </p>
          </CardContent>
        </Card>

        {/* Email Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Service</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {systemInfo?.email?.configured ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-600">Đã cấu hình</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-yellow-600">Chưa cấu hình</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {systemInfo?.email?.host}:{systemInfo?.email?.port}
            </p>
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Server</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-600">Hoạt động</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {systemInfo?.apiUrl || "http://localhost:3000/api"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4 min-w-0">
        <TabsList className="flex h-auto flex-wrap gap-1 p-1 w-full sm:inline-flex sm:w-auto">
          <TabsTrigger value="general" className="flex-1 min-w-0 sm:flex-none text-xs sm:text-sm">
            <Settings className="mr-1.5 h-4 w-4 shrink-0 sm:mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 min-w-0 sm:flex-none text-xs sm:text-sm">
            <Bell className="mr-1.5 h-4 w-4 shrink-0 sm:mr-2" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="email" className="flex-1 min-w-0 sm:flex-none text-xs sm:text-sm">
            <Mail className="mr-1.5 h-4 w-4 shrink-0 sm:mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 min-w-0 sm:flex-none text-xs sm:text-sm">
            <Shield className="mr-1.5 h-4 w-4 shrink-0 sm:mr-2" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt cảnh báo</CardTitle>
              <CardDescription>
                Cấu hình ngưỡng cảnh báo khi người dùng không check-in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alert-threshold">Số ngày không check-in để cảnh báo</Label>
                <Input
                  id="alert-threshold"
                  type="number"
                  min="1"
                  max="30"
                  value={alertDaysThreshold}
                  onChange={(e) => setAlertDaysThreshold(e.target.value)}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Hệ thống sẽ gửi cảnh báo khi người dùng không check-in quá {alertDaysThreshold} ngày
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
              <CardDescription>
                Phiên bản và thông tin kỹ thuật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phiên bản Admin</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{systemInfo?.adminVersion || "v1.0.0"}</Badge>
                    <span className="text-sm text-muted-foreground">Next.js 16</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phiên bản API</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{systemInfo?.apiVersion || "v1.0.0"}</Badge>
                    <span className="text-sm text-muted-foreground">Express.js</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Database</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">PostgreSQL 14+</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mobile App</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Flutter 3.x</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình thông báo</CardTitle>
              <CardDescription>
                Bật/tắt và cấu hình các loại thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi email cảnh báo đến người liên hệ khẩn cấp
                  </p>
                </div>
                <Switch
                  checked={enableEmailNotifications}
                  onCheckedChange={setEnableEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo đẩy (Push)</Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi push notification đến ứng dụng mobile
                  </p>
                </div>
                <Switch
                  checked={enablePushNotifications}
                  onCheckedChange={setEnablePushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giờ nhắc nhở mặc định</CardTitle>
              <CardDescription>
                Thời gian gửi nhắc nhở check-in hàng ngày
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nhắc nhở buổi sáng</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={reminderTime1}
                      onChange={(e) => setReminderTime1(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nhắc nhở buổi trưa</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={reminderTime2}
                      onChange={(e) => setReminderTime2(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Giờ nhắc nhở mặc định cho người dùng mới. Người dùng có thể tự thay đổi trong ứng dụng.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình SMTP</CardTitle>
              <CardDescription>
                Cài đặt máy chủ email để gửi thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Email gửi</Label>
                  <Input
                    id="sender-email"
                    type="email"
                    placeholder="noreply@dierolive.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Tên người gửi</Label>
                  <Input
                    id="sender-name"
                    placeholder="Die or Live App"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <Label htmlFor="test-email">Email kiểm tra</Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="your@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleTestEmail}
                    disabled={testingEmail}
                  >
                    {testingEmail ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    Gửi email test
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  Kiểm tra kết nối Database
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mẫu Email</CardTitle>
              <CardDescription>
                Xem trước nội dung email cảnh báo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="font-medium mb-2">Chủ đề: 🚨 Cảnh báo khẩn cấp - Die or Live</p>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Xin chào [Tên người liên hệ],</p>
                  <p>
                    Chúng tôi muốn thông báo rằng [Tên người dùng] đã không check-in 
                    trong ứng dụng Die or Live trong [X] ngày.
                  </p>
                  <p>
                    Đây có thể là dấu hiệu cần được quan tâm. Vui lòng liên hệ với họ 
                    để đảm bảo an toàn.
                  </p>
                  <p className="mt-4">Trân trọng,<br />Đội ngũ Die or Live</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật API</CardTitle>
              <CardDescription>
                Cấu hình bảo mật cho API server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>JWT Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Xác thực người dùng bằng JSON Web Token
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">Đang bật</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Firebase Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Xác thực qua Firebase cho ứng dụng mobile
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">Đang bật</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>CORS Protection</Label>
                  <p className="text-sm text-muted-foreground">
                    Bảo vệ API khỏi cross-origin requests không hợp lệ
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">Đang bật</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Giới hạn số request để chống DDoS
                  </p>
                </div>
                <Badge variant="secondary">Chưa cấu hình</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nhật ký hoạt động</CardTitle>
              <CardDescription>
                Theo dõi các hoạt động quan trọng trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>API Server đang hoạt động</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date().toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Database kết nối</span>
                  </div>
                  <span className="text-muted-foreground">
                    {systemInfo?.database?.status === 'connected' ? 'Đang hoạt động' : 'Mất kết nối'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

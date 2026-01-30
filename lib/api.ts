const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dieorlive-backend.trancongtien.io.vn/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<{
      totalUsers: number;
      activeUsers: number;
      totalCheckIns: number;
      todayCheckIns: number;
      pendingAlerts: number;
      recentCheckIns: any[];
      recentUsers: any[];
      checkInsTrend: any[];
    }>('/admin/dashboard');
  }

  // Users
  async getUsers(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    status?: 'all' | 'active' | 'inactive';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    
    return this.request<{ users: any[]; total: number; page: number; totalPages: number }>(
      `/admin/users?${query.toString()}`
    );
  }

  async getUser(id: number) {
    return this.request<{ user: any; stats: any; contacts: any[]; recentCheckIns: any[] }>(
      `/admin/users/${id}`
    );
  }

  async updateUserStatus(id: number, isActive: boolean) {
    return this.request<{ user: any }>(
      `/admin/users/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ is_active: isActive }),
      }
    );
  }

  async deleteUser(id: number) {
    return this.request<{ success: boolean; message: string }>(
      `/admin/users/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Check-ins
  async getCheckIns(params?: {
    page?: number;
    limit?: number;
    userId?: number;
    search?: string;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.userId) query.set('user_id', params.userId.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.date) query.set('date', params.date);
    if (params?.dateFrom) query.set('date_from', params.dateFrom);
    if (params?.dateTo) query.set('date_to', params.dateTo);

    return this.request<{ 
      checkIns: any[]; 
      total: number; 
      page: number; 
      totalPages: number;
      stats: { total: number; today: number; averageTime: string };
      availableDates: string[];
    }>(
      `/admin/checkins?${query.toString()}`
    );
  }

  // Emergency Alerts
  async getEmergencyAlerts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'pending' | 'sent';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'all') query.set('status', params.status);

    return this.request<{ 
      alerts: any[]; 
      total: number; 
      page: number; 
      totalPages: number;
      stats: { total: number; pending: number; sent: number };
    }>(
      `/admin/alerts?${query.toString()}`
    );
  }

  async sendEmergencyAlert(userId: number, contactEmail: string) {
    return this.request<{ success: boolean; message: string }>(
      `/admin/alerts/send`,
      { 
        method: 'POST',
        body: JSON.stringify({ user_id: userId, contact_email: contactEmail })
      }
    );
  }

  // Notifications
  async getNotificationLogs(params?: {
    page?: number;
    limit?: number;
    userId?: number;
    search?: string;
    type?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.userId) query.set('user_id', params.userId.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.type) query.set('type', params.type);

    return this.request<{ 
      logs: any[]; 
      total: number; 
      page: number; 
      totalPages: number;
      stats: { total: number; reminder: number; warning: number; emergency: number };
    }>(
      `/admin/notifications?${query.toString()}`
    );
  }

  // Export functions
  getExportUsersUrl() {
    return `${this.baseUrl}/admin/export/users`;
  }

  getExportCheckInsUrl(params?: { dateFrom?: string; dateTo?: string }) {
    const query = new URLSearchParams();
    if (params?.dateFrom) query.set('date_from', params.dateFrom);
    if (params?.dateTo) query.set('date_to', params.dateTo);
    return `${this.baseUrl}/admin/export/checkins?${query.toString()}`;
  }

  // Settings
  async getSettings() {
    return this.request<{
      settings: Record<string, { value: string; description: string }>;
      systemInfo: {
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
      };
    }>('/admin/settings');
  }

  async updateSettings(settings: Record<string, string>) {
    return this.request<{ success: boolean; settings: any[] }>(
      '/admin/settings',
      {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      }
    );
  }

  async updateSetting(key: string, value: string) {
    return this.request<{ success: boolean; setting: any }>(
      `/admin/settings/${key}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ value }),
      }
    );
  }

  async testDatabaseConnection() {
    return this.request<{ status: string; ping: number; version?: string; error?: string }>(
      '/admin/settings/test/database'
    );
  }

  async testEmailConfiguration(testEmail: string) {
    return this.request<{ success: boolean; message?: string; error?: string }>(
      '/admin/settings/test/email',
      {
        method: 'POST',
        body: JSON.stringify({ testEmail }),
      }
    );
  }
}

export const api = new ApiService();

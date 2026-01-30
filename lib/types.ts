// Types for the admin dashboard

export interface User {
  id: number;
  firebase_uid: string;
  email: string;
  full_name: string | null;
  gender: 'male' | 'female' | 'other' | null;
  date_of_birth: string | null;
  phone: string | null;
  avatar_url: string | null;
  fcm_token: string | null;
  reminder_time_1: string;
  reminder_time_2: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: number;
  user_id: number;
  name: string;
  relationship: string | null;
  email: string;
  phone: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: number;
  user_id: number;
  check_in_date: string;
  check_in_time: string;
  note: string | null;
  created_at: string;
  user?: User;
}

export interface NotificationLog {
  id: number;
  user_id: number;
  type: 'reminder' | 'warning' | 'emergency_email';
  message: string | null;
  sent_at: string;
  is_read: boolean;
}

export interface EmergencyAlert {
  id: number;
  user_id: number;
  contact_id: number;
  alert_type: string;
  days_missed: number;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
  user?: User;
  contact?: EmergencyContact;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCheckIns: number;
  todayCheckIns: number;
  pendingAlerts: number;
  averageStreak: number;
}

export interface UserWithStats extends User {
  total_check_ins?: number;
  current_streak?: number;
  last_check_in?: string;
  contacts_count?: number;
}

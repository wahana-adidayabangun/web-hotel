// features/profile/types/profileTypes.ts

export interface PointUser {
  id: number;
  user_id: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  user_id: number;
  address: string | null;
  postal_code: string | null;
  image: string | null;
  bio: string | null;
  is_public: boolean;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  otp: string | null;
  otp_expires_at: string | null;
  is_verified: number;
  is_active: number;
  is_banned: number;
  fcm_token: string | null;
  provider: string | null;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  point_user: PointUser | null;
  customer: Customer | null;
}

export interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

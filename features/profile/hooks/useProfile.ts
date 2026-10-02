// features/profile/hooks/useProfile.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { getProfileApi } from "@/features/profile/services/profileApi";
import { UserProfile } from "@/features/profile/types/profileTypes";

export const useProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileApi();
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data profil.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    router.push("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, logout, refetch: fetchProfile };
};

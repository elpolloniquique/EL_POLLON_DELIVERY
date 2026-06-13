import { useEffect } from 'react';
import { restoreSession } from '@/services/auth-service';
import { useAuthStore } from '@/store/authStore';

export function useAuthInit() {
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    restoreSession().then((profile) => {
      setProfile(profile);
      setLoading(false);
    });
  }, [setProfile, setLoading]);
}

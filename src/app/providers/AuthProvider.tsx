import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  onAuthStateChangedListener,
  register as registerService
} from '../../services/authService';
import {
  getMyPrivateProfile,
  getUserById,
  updateMyPrivateProfile,
  updateUserProfile
} from '../../services/userService';
import { getErrorMessage } from '../../utils/errors';

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const syncUser = useCallback(async (authUser: any) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      const [profile, privateProfile] = await Promise.all([
        getUserById(authUser.uid),
        getMyPrivateProfile(authUser.uid)
      ]);
      setUser({
        uid: authUser.uid,
        email: authUser.email,
        ...profile,
        ...privateProfile
      });
    } catch (err) {
      console.error('[AuthProvider] Erro ao sincronizar usuário:', err);
    }
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      syncUser(currentUser).finally(() => setLoading(false));
    }

    const unsubscribe = onAuthStateChangedListener((authUser) => {
      syncUser(authUser).finally(() => setLoading(false));
    });

    return unsubscribe;
  }, [syncUser]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      await loginService(email, password);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      await registerService(payload);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    if (!user?.uid) return;
    setLoading(true);
    setError('');
    try {
      await updateUserProfile(user.uid, data);
      // Re-sincroniza para atualizar o estado local
      await syncUser({ uid: user.uid, email: user.email });
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, syncUser]);

  const updatePrivateProfile = useCallback(async (data: any) => {
    if (!user?.uid) return;
    setLoading(true);
    setError('');
    try {
      await updateMyPrivateProfile(user.uid, data);
      await syncUser({ uid: user.uid, email: user.email });
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, syncUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await logoutService();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      updateProfile,
      updatePrivateProfile,
      logout
    }),
    [user, loading, error, login, register, updateProfile, updatePrivateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

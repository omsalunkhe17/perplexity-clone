import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  const handleRegister = useCallback(
    async ({ email, username, password }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const data = await register({ email, username, password });
        return { success: true, message: data?.message || "Registration successful" };
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Registration failed";
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const data = await login({ email, password });
        dispatch(setUser(data.user));
        return { success: true, user: data.user };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Login failed";
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleGetMe = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      dispatch(setError(null));
      return { success: true, user: data.user };
    } catch (err) {
      dispatch(setUser(null));
      if (err.response?.status !== 401) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch user data";
        dispatch(setError(errorMsg));
      } else {
        dispatch(setError(null));
      }
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
}

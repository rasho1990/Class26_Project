import { useEffect, useState, useCallback } from "react";

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((userId, token, expirationTime) => {
    // After login set token and userId from token in state to pass down into context
    setToken(token);
    setUserId(userId);

    // Set expiration time or create new one (for 1 hour) for auto logout
    const tokenExpires =
      expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationTime(tokenExpires);

    // Save token in browser for auto login
    const cookies = JSON.stringify({
      userId,
      token,
      expirationTime: tokenExpires.toISOString(),
    });
    localStorage.setItem("userSession", cookies);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationTime(null);
    setUserId(null);
    // Removes userSession
    localStorage.removeItem("userSession");
    // Remove password from local storage
    localStorage.removeItem("password");
  }, []);

  useEffect(() => {
    // Only set time if there's a token and remaining token time
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      // Auto logout user if token expiration time has passed
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      // If user manually logs out we clear timer
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationTime]);

  useEffect(() => {
    // Check localStorage for userSession
    const storedSession = JSON.parse(localStorage.getItem("userSession"));

    // If token and expiration time hasn't passed yet then auto-login
    if (
      storedSession &&
      storedSession.token &&
      new Date(storedSession.expirationTime) > new Date()
    ) {
      login(
        storedSession.userId,
        storedSession.token,
        new Date(storedSession.expirationTime)
      );
    }
  }, [login]);

  return { token, tokenExpirationTime, userId, login, logout };
};

export default useAuth;

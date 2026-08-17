import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  // ======================================================
  // TOKEN
  // ======================================================

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token");
  });

  // ======================================================
  // USER
  // ======================================================

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data in sessionStorage:", error);

      sessionStorage.removeItem("user");

      return null;
    }
  });

  // ======================================================
  // LOGIN
  // ======================================================

  const login = (newToken, newUser) => {
    sessionStorage.setItem("token", newToken);

    sessionStorage.setItem("user", JSON.stringify(newUser));

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(newToken);
    setUser(newUser);
  };

  // ======================================================
  // UPDATE USER
  // ======================================================

  const updateUser = (updatedUser) => {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    setUser(updatedUser);
  };

  // ======================================================
  // REFRESH USER FROM BACKEND
  // ======================================================

  const refreshUser = async () => {
    const currentToken = sessionStorage.getItem("token");

    if (!currentToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem("token");

          sessionStorage.removeItem("user");

          setToken(null);
          setUser(null);
        }

        return null;
      }

      const data = await response.json();

      if (data?.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);

        return data.user;
      }

      return null;
    } catch (error) {
      console.error("Failed to refresh user:", error);

      return null;
    }
  };

  // ======================================================
  // REFRESH USER WHEN APP LOADS
  // ======================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    refreshUser();
  }, [token]);

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    sessionStorage.removeItem("token");

    sessionStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ======================================================
  // AUTH STATE
  // ======================================================

  const isAuth = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        updateUser,
        refreshUser,
        logout,
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================================================
// useAuth
// ======================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;

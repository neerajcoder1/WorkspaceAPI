import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, workspaceAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('worksphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('worksphere_token'));
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile and workspaces on mount
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('worksphere_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const [profileRes, workspacesRes] = await Promise.all([
          authAPI.getProfile(),
          workspaceAPI.list(),
        ]);

        const currentUser = profileRes.data.data.user;
        const userWorkspaces = workspacesRes.data.data.workspaces || [];

        setUser(currentUser);
        localStorage.setItem('worksphere_user', JSON.stringify(currentUser));
        setWorkspaces(userWorkspaces);

        // Set active workspace from localStorage or default to first workspace
        const savedWorkspaceId = localStorage.getItem('worksphere_active_ws');
        const matched = userWorkspaces.find((w) => String(w.id) === String(savedWorkspaceId));
        if (matched) {
          setActiveWorkspace(matched);
        } else if (userWorkspaces.length > 0) {
          setActiveWorkspace(userWorkspaces[0]);
          localStorage.setItem('worksphere_active_ws', String(userWorkspaces[0].id));
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('worksphere_token');
        localStorage.removeItem('worksphere_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [token]);

  const selectWorkspace = (ws) => {
    setActiveWorkspace(ws);
    if (ws) {
      localStorage.setItem('worksphere_active_ws', String(ws.id));
    } else {
      localStorage.removeItem('worksphere_active_ws');
    }
  };

  const refreshWorkspaces = async () => {
    try {
      const res = await workspaceAPI.list();
      const wsList = res.data.data.workspaces || [];
      setWorkspaces(wsList);
      if (!activeWorkspace && wsList.length > 0) {
        selectWorkspace(wsList[0]);
      } else if (activeWorkspace) {
        // Keep current selected if it still exists
        const exists = wsList.find((w) => w.id === activeWorkspace.id);
        if (exists) {
          setActiveWorkspace(exists);
        } else if (wsList.length > 0) {
          selectWorkspace(wsList[0]);
        }
      }
      return wsList;
    } catch (err) {
      console.error('Failed to refresh workspaces:', err);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: loggedInUser, token: authToken } = res.data.data;
    localStorage.setItem('worksphere_token', authToken);
    localStorage.setItem('worksphere_user', JSON.stringify(loggedInUser));
    setToken(authToken);
    setUser(loggedInUser);

    // Fetch workspaces immediately
    try {
      const wsRes = await workspaceAPI.list();
      const wsList = wsRes.data.data.workspaces || [];
      setWorkspaces(wsList);
      if (wsList.length > 0) {
        selectWorkspace(wsList[0]);
      }
    } catch (e) {
      console.error(e);
    }

    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    // Auto-login after registration
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('worksphere_token');
    localStorage.removeItem('worksphere_user');
    localStorage.removeItem('worksphere_active_ws');
    setUser(null);
    setToken(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        workspaces,
        activeWorkspace,
        selectWorkspace,
        refreshWorkspaces,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

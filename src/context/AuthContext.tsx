import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database
const USERS_KEY = 'support_dashboard_users';
const SESSION_KEY = 'support_dashboard_session';

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

function getStoredUsers(): StoredUser[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const userData: User = {
      id: foundUser.id,
      fullName: foundUser.fullName,
      email: foundUser.email,
    };

    setUser(userData);
    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    }

    return { success: true };
  };

  const signup = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      password,
    };

    saveUsers([...users, newUser]);

    const userData: User = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
    };

    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

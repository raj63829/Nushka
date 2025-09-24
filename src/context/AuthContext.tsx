import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

// -----------------
// Types
// -----------------
interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: any[];
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: UserProfile | null }
  | { type: "LOGOUT" };

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
};

// -----------------
// Reducer
// -----------------
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// -----------------
// Context
// -----------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------
// Provider
// -----------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (userProfile) {
            dispatch({ type: "SET_USER", payload: userProfile });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (userProfile) {
            dispatch({ type: "SET_USER", payload: userProfile });
          }
        } else if (event === "SIGNED_OUT") {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // -----------------
  // Actions
  // -----------------

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert({
          user_id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          addresses: [],
        });

        if (profileError) throw profileError;
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (userData: Partial<UserProfile>) => {
    try {
      if (!state.user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("users")
        .update(userData)
        .eq("user_id", state.user.user_id);

      if (error) throw error;

      dispatch({ type: "SET_USER", payload: { ...state.user, ...userData } });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        loginWithGoogle,
        signInWithPhone,
        verifyPhoneOtp,
        logout,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -----------------
// Hook
// -----------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

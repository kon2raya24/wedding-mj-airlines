"use client";

import { createContext, useContext, useState } from "react";
import type { SessionPayload } from "@/lib/session";

type AuthContextValue = {
  session: SessionPayload | null;
  setSession: (s: SessionPayload | null) => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  setSession: () => {},
});

export function AuthProvider({
  initialSession,
  children,
}: {
  initialSession: SessionPayload | null;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<SessionPayload | null>(initialSession);
  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

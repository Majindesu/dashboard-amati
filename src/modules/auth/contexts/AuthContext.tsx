// Directive to enforce client-side operation in a Next.js application.
"use client";

// Importing React functionalities and required components.
import React, { ReactElement, ReactNode, createContext, useContext } from "react";
import SidebarMenu from "@/modules/dashboard/types/SidebarMenu";

// Defining the structure for user data within the authentication context.
interface UserData {
  id: string,
  name: string,
  email: string,
  photoProfile: string | null,
  sidebarMenus: SidebarMenu[]
}

// State structure for the authentication context.
interface AuthContextState {
  user: UserData | null;
  // fetchUserData: () => void;
  // logout: () => void;
}

// Props type definition for the AuthContextProvider component.
interface Props {
  children: ReactNode;
  userData: UserData | null;
}

// Creating the authentication context with an undefined initial value.
const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Provides an authentication context to wrap around components that require authentication data.
 * This component initializes user data state, fetches user data upon component mount, and provides
 * a logout function to clear the user data.
 *
 * @param {Props} props - Component props containing children to be rendered within the provider.
 * @returns {ReactElement} A provider component wrapping children with access to authentication context.
 */
export const AuthContextProvider = ({ children, userData }: Props): ReactElement => {

  // Providing authentication state and functions to the context consumers.
  return (
    <AuthContext.Provider value={{ user: userData }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the authentication context. This hook ensures the context is used within a provider.
 *
 * @returns {AuthContextState} The authentication context state including user data and auth functions.
 * @throws {Error} Throws an error if the hook is used outside of an AuthContextProvider.
 */
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

// Directive to enforce client-side operation in a Next.js application.
"use client";

// Importing React functionalities and required components.
import React, { ReactElement, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import getMyDetailAction from "../actions/getMyDetailAction";
import withServerAction from "@/modules/dashboard/utils/withServerAction";

// Defining the structure for user data within the authentication context.
interface UserData {
  name: string;
  email: string;
  photoUrl: string | null;
  // Additional user fields can be added here.
}

// State structure for the authentication context.
interface AuthContextState {
  user: UserData | null;
  fetchUserData: () => void;
  logout: () => void;
}

// Props type definition for the AuthContextProvider component.
interface Props {
  children: ReactNode;
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
export const AuthContextProvider = ({ children }: Props): ReactElement => {
  const [user, setUser] = useState<UserData | null>(null);

  // Function to fetch user data and update state accordingly.
  const fetchUserData = useCallback(() => {
    withServerAction(getMyDetailAction)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        notifications.show({
          title: 'Error',
          message: 'Error while retrieving user data',
          color: 'red',
        });
        console.error("Error while retrieving user data", error);
      });
  }, []);

  // Fetch user data on component mount.
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Function to clear user data, effectively logging the user out.
  const logout = () => {
    setUser(null);
  };

  // Providing authentication state and functions to the context consumers.
  return (
    <AuthContext.Provider value={{ user, fetchUserData, logout }}>
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

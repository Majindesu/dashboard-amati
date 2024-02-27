"use client";
import React, {
	ReactElement,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import getUser from "../actions/getMyDetailAction";
import withServerAction from "@/modules/dashboard/utils/withServerAction";
import getMyDetailAction from "../actions/getMyDetailAction";
import { notifications } from "@mantine/notifications";

interface UserData {
	name: string;
	email: string;
	photoUrl: string | null;
	// Add additional user fields as needed
}

interface AuthContextState {
	user: UserData | null;
	fetchUserData: () => void;
	logout: () => void;
}

interface Props {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({ children }: Props) => {
	const [user, setUser] = useState<UserData | null>(null);

	const fetchUserData = useCallback(() => {
		
		withServerAction(getMyDetailAction)
			.then((response) => {
				setUser(response.data);
			})
			.catch((error) => {
				console.error("Error while retrieving user data")
			})
	}, []);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, fetchUserData, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthContextProvider");
	}
	return context;
};

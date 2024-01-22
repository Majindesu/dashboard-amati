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
import getUser from "../actions/getUser";

interface UserData {
	name: string;
    email: string
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
        const getUserData = async () => {
            const user = await getUser();
            setUser(user)
        }

        getUserData().then()
    }, [])

	useEffect(() => {       
        fetchUserData()
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

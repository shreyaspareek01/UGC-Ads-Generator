import { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    credits: number;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoaded: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    updateCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoaded(true);

    }, []);

    const login = (token: string, user: AuthUser) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateCredits = (credits: number) => {
        if (user) {
            const updated = { ...user, credits };
            localStorage.setItem('user', JSON.stringify(updated));
            setUser(updated);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoaded, login, logout, updateCredits }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);

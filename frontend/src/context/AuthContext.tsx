'use client';

import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import socket from '@/lib/socket';

interface User {
    id(arg0: string, id: any): unknown;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    error: Error | null;
    login: (username: string, password: string) => Promise<void>;
    register: (name: string, username: string, password: string, passwordConfirmation: string,) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [cookie, setCookie, removeCookie] = useCookies(['token']);

    const router = useRouter();

    useEffect(() => {
        const token = cookie.token;

        if (!token || token == 'undefined') {
            setUser(null);
            socket.disconnect();
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            setUser(decodedToken as User);
            socket.auth = { user: decodedToken };
            socket.connect();
        } catch (error) {
            console.error("Error decoding token:", error);
            setError(error as Error);
        }
    }, [cookie.token]);

    const login = async (username: string, password: string) => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        try {
            const response = await fetch('http://localhost:8888/api/auth/login', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ email: username, password: password })
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                setError(new Error(data.message || 'Login failed'));
                return;
            }

            setCookie('token', data.token, { path: '/' });
            router.push('/chat');
        } catch (e) {
            setError(e as Error);
        }
    };

    const register = async (name: string, username: string, password: string, passwordConfirmation: string) => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        
        try {
            const response = await fetch('http://localhost:8888/api/auth/register', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ name: name, email: username, password: password, password_confirmation: passwordConfirmation })
            });
            
            const data = await response.json();

            if (!response.ok) {
                console.error('Registration failed:', response, data);
                setError(new Error(data.message || 'Registration failed'));
                return;
            }
            
    
            setCookie('token', data.token, { path: '/' });
            router.push('/chat');
        } catch (e) {
            console.error('Erro durante o registro:', e);
            setError(e as Error);
        }
    };
    
    const logout = async () => {
        setUser(null);
        removeCookie('token', { path: '/' });
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('Contexto Inválido');
    }

    return context;
};

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from "next/router";
import { toast } from 'react-toastify';
import jwtDecode from "jwt-decode";

type User = {
    email: string,
    password: string
}

interface AuthContextType {
    // Defina os tipos que você deseja no contexto aqui
    isAuthenticated: boolean;
    user: Profile | null
    signIn: ({ email, password }: User) => Promise<void>
}

type Profile = {
    name: string,
    birth: string,
    profession: string,
    relationship: string,
    country: string,
    city: string,
    user: {
        id: number,
        email: string,
        username: string
    }
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}

function getUserProfileFromToken() {
    const { 'uolkut.access_token': token } = parseCookies();
    if (token) {
        try {
            const decodedToken = jwtDecode<{ profile: Profile }>(token);
            return decodedToken.profile;
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
        }
    }
    return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Profile | null>(null)
    const isAuthenticated = !!user; // Exemplo: usuário está autenticado

    useEffect(() => {
        const tokenCookie = getUserProfileFromToken()
        if (tokenCookie) {
            setUser(tokenCookie)
        }
    }, [])

    useEffect(() => {
        console.log(user)
    }, [user])

    async function signIn({ email, password }: User) {
        const apiUrl = "https://compass-uolkut-api.onrender.com/api/token";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            // localStorage.setItem("access_token", data.access);
            // localStorage.setItem("refresh_token", data.refresh);
            setCookie(undefined, 'uolkut.access_token', data.access, {
                maxAge: 60 * 60 * 24 // 1 dia
            })
            setCookie(undefined, 'uolkut.refresh_token', data.refresh, {
                maxAge: 60 * 60 * 24 // 1 dia
            })

            const tokenCookie = getUserProfileFromToken()
            setUser(tokenCookie)

            Router.push('/dashboard')

            // return true; // Autenticação bem-sucedida
        } else {
            const errorData = await response.json();
            console.error("Falha na autenticação:", errorData);

            const errorMessage = errorData.error || errorData.detail || 'Erro ao autenticar. Verifique suas credenciais.';
            toast.error(errorMessage);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

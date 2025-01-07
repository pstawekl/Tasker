'use client';
import { auth } from '@/app/firebaseConfig';
import { User, onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const token = await user.getIdToken();
                Cookies.set('auth-token', token);
            } else {
                setUser(null);
                Cookies.remove('auth-token');
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (user == undefined) return <div>Loading...</div>;

    if (!loading) return (
        { children }
    );
};

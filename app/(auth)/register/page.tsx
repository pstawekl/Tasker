'use client';

import { auth, googleProvider } from '@/app/firebaseConfig';
import { Button } from '@/components/ui/button';
import Logo from '@/public/logo.webp';
import { createUserWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            if (!result.user || !result.user.uid) {
                throw new Error('No user available after Google sign-in');
            }

            await addUserToDatabase(result.user);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const addUserToDatabase = async (user: User) => {
        const token = await user.getIdToken();
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firebaseId: user.uid,
                email: user.email || email,
                username: user.displayName || '',
                createdAt: new Date().toISOString(),
                picture: user.photoURL || ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create user in database');
        }

        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user || !user.uid) {
                throw new Error('No user ID available');
            }

            addUserToDatabase(user);

            router.push('/dashboard');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full flex flex-col gap-4 p-5 bg-white rounded-lg shadow-md">
                <div className='flex justify-center'>
                    <Image src={Logo} alt="logo" width={50} />
                </div>
                <div className="top-content flex flex-col gap-4">
                    <h2 className="text-2xl font-normal text-center">Utwórz konto</h2>
                    <h3 className='text-gray-500 font-light text-center'>Utwórz swoje konto użytkownika w aplikacji Tasker</h3>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <Button
                        type="submit"
                        variant='black'
                        className='w-100'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                        Utwórz konto
                    </Button>
                </form>
                <div className="other-sign-in-methods flex flex-col gap-4">
                    <div className='w-100 flex flex-row items-center'>
                        <div className='splitter bg-gray-500 h-[1px] w-100'></div>
                        <div className='px-3'>LUB</div>
                        <div className='splitter bg-gray-500 h-[1px] w-100'></div>
                    </div>
                    <Button className='w-100' variant='outline' onClick={handleGoogleSignIn}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="150" height="150" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>

                        Utwórz konto przez Google</Button>
                </div>
            </div>
        </main>
    );
}
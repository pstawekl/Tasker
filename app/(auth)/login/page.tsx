'use client';
import { auth, googleProvider } from '@/app/firebaseConfig';
import { Button } from '@/components/ui/button';
import Logo from '@/public/logo.webp';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isDuringLogin, setIsDuringLogin] = useState(false);

  const handleGoogleSignIn = async (e) => {
    try {
      setIsDuringLogin(true);
      const result = await signInWithPopup(auth, googleProvider);
      await handleLogin(e);

      if (result.user) {
        setIsDuringLogin(false);
        router.push('/dashboard');
      }
    } catch (error) {
      setIsDuringLogin(false);
      console.error('Error signing in with Google:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDuringLogin(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user && user.uid) {
        fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebaseId: user.uid,
            email: user.email,
            username: user.displayName,
            createdAt: user.metadata.creationTime,
            picture: user.photoURL
          })
        }).then((res) => res.json()).then((res) => {
          const { user } = res;

          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            setIsDuringLogin(false);
            router.push('/dashboard');
          }
        }).catch((err) => { setError(err) }).finally(() => {
          setIsDuringLogin(false);
        });
      } else {
        setIsDuringLogin(false);
        setError("User UID is not defined.");
      }
    } catch (error: any) {
      setError(error.message);
      setIsDuringLogin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96 flex flex-col gap-4">
        <div className='flex justify-center'>
          <Image src={Logo} alt="logo" width={50} />
        </div>
        <div className="top-content flex flex-col gap-4">
          <h1 className="text-2xl font-normal text-center">Witaj</h1>
          <h3 className='text-gray-500 font-light text-center'>Zaloguj się do aplikacji Tasker używając adresu e-mail lub konta Google</h3>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <Button
            type="submit"
            variant='black'
            className='w-100'
            disabled={isDuringLogin}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
            Zaloguj się
          </Button>
        </form>
        <div className="other-sign-in-methods flex flex-col gap-4">
          <div className='w-100 flex flex-row items-center'>
            <div className='splitter bg-gray-500 h-[1px] w-100'></div>
            <div className='px-3'>LUB</div>
            <div className='splitter bg-gray-500 h-[1px] w-100'></div>
          </div>
          <Button className='w-100' variant='outline' disabled={isDuringLogin} onClick={handleGoogleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="150" height="150" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Zaloguj się przez Google
          </Button>
        </div>
      </div>
    </div>
  );
}

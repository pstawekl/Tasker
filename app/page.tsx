'use client';

import { auth } from '@/app/firebaseConfig';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import Hero from '../components/Hero';

export default function Index() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      setUser(auth.currentUser);
      setLoading(false);

      console.log("user", user);
    }
  }, [auth]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && user && router) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  if (loading || !router) return <Spinner />;
  return (
    <div className='h-100'>
      <Hero />
    </div>
  );
}

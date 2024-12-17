'use client';

import React, { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Hero from '../components/Hero';
import { useRouter } from 'next/navigation';
import { Spinner } from 'reactstrap';

export default function Index() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading && user && router) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading || !router) return <Spinner />;
  return (
    <>
      <Hero />
    </>
  );
}

'use client'
import React from 'react';
import { Button, Spinner } from 'reactstrap';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import Logo from '@/public/logo.webp';
import Image from 'next/image';

function Hero() {
  const { user, isLoading } = useUser();
  return (
    <div className="hero text-center w-[100vw] h-full min-h-[800px] d-flex flex-column justify-center items-center" data-testid="hero">
      <Image src={Logo} alt="Logo" width={100} />
      <h1 className="mb-3" data-testid="hero-title">
        Tasker
      </h1>

      <p className="lead mb-5" data-testid="hero-lead">
        Aplikacja do zarządzania zadaniami w ciągu dnia.
      </p>
      {!user && !isLoading ? <Link href="/api/auth/login"><Button>Zaloguj się</Button></Link> : <Spinner />}
    </div>
  )
};

export default Hero;

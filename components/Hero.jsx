'use client';
import { auth } from '@/app/firebaseConfig';
import Logo from '@/public/logo.webp';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spinner } from 'reactstrap';
import AnchorLink from './AnchorLink';
import { Button } from './ui/button';

function Hero() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="text-center w-[100vw] h-full h-100 d-flex flex-column justify-center items-center">
      <Image src={Logo} alt="Logo" width={100} />
      <h1 className="mb-3" data-testid="hero-title">
        Tasker
      </h1>
      <p className="lead mb-5" data-testid="hero-lead">
        Aplikacja do zarządzania zadaniami w ciągu dnia.
      </p>
      {!user && !loading ? (
        <div className="flex flex-col lg:flex-row gap-3">
          <AnchorLink href="/login">
            <Button variant="black" className="w-[200px] text-white">
              Zaloguj
            </Button>
          </AnchorLink>
          <AnchorLink href="/register">
            <Button variant="black" className="w-[200px] text-white">
              Zarejestruj
            </Button>
          </AnchorLink>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default Hero;

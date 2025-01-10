'use client';
import { auth } from '@/app/firebaseConfig';
import Loading from '@/components/Loading';
import { User as DbUser } from '@/lib/models/users';
import DefaultUserAvatar from '@/public/default-user-avatar.jpg';
import { User } from 'firebase/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';


export default function Profile() {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbUser, setDbUser] = useState<DbUser>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setIsLoading(false);
        console.log(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetch('/api/postgres/get-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firebase_id: user.uid })
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setDbUser(data.user as DbUser);
          }
        })
        .catch(error => console.error('Error fetching user from DB:', error));
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      {isLoading && <Loading />}
      {user && (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start mb-5 text-center md:text-left" data-testid="profile">
            <div className="md:w-1/4 mb-4 md:mb-0">
              <Image
                src={user.photoURL || DefaultUserAvatar}
                alt="Profile"
                className="rounded-full img-fluid profile-picture"
                data-testid="profile-picture"
                width={100}
                height={100}
              />
            </div>
            <div className="md:w-3/4">
              <h2 className="text-2xl font-bold" data-testid="profile-name">{user.email}</h2>
              <p className="text-lg text-gray-600" data-testid="profile-email">
                {user.email}
              </p>
            </div>
          </div>
          {dbUser && (
            <div className="bg-white shadow-md rounded p-4 mb-5">
              <p className="text-lg"><span className="font-semibold">ID:</span> {dbUser.id}</p>
              <p className="text-lg"><span className="font-semibold">Username:</span> {dbUser.username}</p>
              <p className="text-lg"><span className="font-semibold">Created At:</span> {new Date(dbUser.created_at).toLocaleString()}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

'use client';
import { auth } from '@/app/firebaseConfig';
import Loading from '@/components/Loading';
import { User as DbUser } from '@/lib/models/users';
import { User } from 'firebase/auth';
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
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <img
                src={user.photoURL || '/default-profile.png'}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.email}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          {dbUser && (
            <Row className="mb-5">
              <Col>
                <p>ID: {dbUser.id}</p>
                <p>Username: {dbUser.username}</p>
                <p>Created At: {new Date(dbUser.created_at).toLocaleString()}</p>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
}

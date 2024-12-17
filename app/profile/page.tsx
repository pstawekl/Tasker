'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { User } from '@/lib/models/users';


function Profile() {
  const { user, isLoading } = useUser();
  const [dbUser, setDbUser] = useState<User>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/postgres/get-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth0_id: user.sub })
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setDbUser(data.user as User);
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
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
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

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
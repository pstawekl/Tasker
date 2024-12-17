import { executeQuery } from '@/lib/db';
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = handleAuth({
  callback: async (req, res) => {
    try {
      return await handleCallback(req, res, { afterCallback });
    } catch (error) {
      console.error('Wystąpił błąd podczas logowania', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
});

const afterCallback = async (req, session, state) => {
  if (!session || !session.user) {
    console.log('Nie można uzyskać informacji o sesji użytkownika');
    throw new Error('Session information is missing');
  }

  try {
    const { user } = session;
    const {
      nickname: username,
      email,
      sub: auht0_id,
      created_at,
      picture
    }: { nickname?: string; email?: string; sub?: string; created_at?: string; picture?: string } = session.user;

    if (!auht0_id || (!email && !auht0_id)) {
      console.log('Missing required fields');
      throw new Error('Missing required fields');
    }

    const checkQuery = `SELECT * FROM users WHERE auth0_id = $1`;
    let checkResult = await executeQuery(checkQuery, [auht0_id]);

    let dbUser = checkResult.rows[0];

    if (!user) {
      const insertQuery = `
                INSERT INTO users (auth0_id, email, username, created_at, picture)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
      const insertResult = await executeQuery(insertQuery, [auht0_id, email, username, created_at, picture]);
      checkResult = await executeQuery(checkQuery, [auht0_id]);
      dbUser = checkResult.rows[0];
    }

    return session;
  } catch (error) {
    console.error('Błąd podczas komunikacji z bazą danych', error);
    console.log('Internal Server Error');
    NextResponse.json({ error: 'Internal Server Error', session: null }, { status: 500 });
  }
};

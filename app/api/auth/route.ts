import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkTokenFromRequest } from '../utils/firebaseAdmin';

export async function POST(req) {
  try {
    const isTokenValid = await checkTokenFromRequest(req);

    if (!isTokenValid) {
      console.log('invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { firebaseId, email, username, createdAt, picture } = await req.json();

    const checkQuery = `SELECT * FROM users WHERE firebase_id = $1`;
    let checkResult = await executeQuery(checkQuery, [firebaseId]);
    let dbUser = checkResult.rows[0];

    if (!dbUser) {
      const insertQuery = `
        INSERT INTO users (firebase_id, email, username, created_at, picture)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      console.log('insertQuery', insertQuery);
      checkResult = await executeQuery(insertQuery, [firebaseId, email, username, createdAt, picture]);
      dbUser = checkResult.rows[0];
    }

    if (!dbUser) {
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }

    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

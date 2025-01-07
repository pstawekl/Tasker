import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    console.log('on the server');

    const { firebaseId, email, username, createdAt, picture } = await req.json();

    console.log('after req.body', { firebaseId, email, username, createdAt, picture });

    const checkQuery = `SELECT * FROM users WHERE firebase_id = $1`;
    let checkResult = await executeQuery(checkQuery, [firebaseId]);
    let dbUser = checkResult.rows[0];

    console.log('after checkQuery');

    if (!dbUser) {
      const insertQuery = `
        INSERT INTO users (firebase_id, email, username, created_at, picture)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      await executeQuery(insertQuery, [firebaseId, email, username, createdAt, picture]);
      checkResult = await executeQuery(checkQuery, [firebaseId]);
      dbUser = checkResult.rows[0];
    }

    console.log('after insertQuery');

    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkTokenFromRequest } from '../../utils/firebaseAdmin';

export const POST = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);

    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { firebase_id } = body;

    console.log('firebase_id', firebase_id);

    if (!firebase_id) {
      return NextResponse.json({ error: 'Missing firebase_id' }, { status: 400 });
    }

    const result = await executeQuery('SELECT * FROM users WHERE firebase_id = $1', [firebase_id]);
    console.log('result.rows', result.rows);
    return NextResponse.json({ users: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

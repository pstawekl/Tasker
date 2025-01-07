import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const { firebase_id } = data;
    const userInfo = await executeQuery(
      'SELECT id, email, username, created_at, picture FROM users WHERE firebase_id = $1',
      [firebase_id]
    );
    return NextResponse.json({ user: userInfo.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas komunikacji z bazą danych', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

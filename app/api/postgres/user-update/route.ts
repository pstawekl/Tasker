import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const body = await req.json();
  const { auth0_id } = body;

  if (!auth0_id) {
    return NextResponse.json({ message: 'Missing auth0_id parameter' }, { status: 400 });
  }

  try {
    const result = await executeQuery(
      'SELECT id, auth0_id, email, username, created_at, picture FROM users WHERE auth0_id = $1',
      [auth0_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

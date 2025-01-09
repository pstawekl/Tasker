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
    const { name, user_id } = body;

    if (!name || !user_id) {
      return NextResponse.json({ message: 'Please fill all the fields' }, { status: 400 });
    }

    const query = `
        INSERT INTO task_lists (name, user_id, created_at)
        VALUES ($1, $2, NOW())
        RETURNING *
    `;

    const values = [name, user_id];

    const result = await executeQuery(query, values);

    return NextResponse.json({ info: result.command }, { status: 201 });
  } catch (error) {
    console.error('Error adding task list:', error);
    return NextResponse.json({ error: 'Error adding task list' }, { status: 500 });
  }
};

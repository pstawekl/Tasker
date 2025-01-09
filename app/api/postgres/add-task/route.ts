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
    const { task } = body;

    const query = `
            INSERT INTO tasks (title, description, due_date, list_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    const values = [task.title, task.description, task.due_date, task.list_id];

    const result = await executeQuery(query, values);

    return NextResponse.json({ task: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json({ error: 'Error adding task' }, { status: 500 });
  }
};

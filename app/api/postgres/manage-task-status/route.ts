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
    const { taskId, isCompleted } = body;

    const query = `
        UPDATE tasks
        SET is_completed = $2
        WHERE id = $1
        RETURNING *;
    `;

    const values = [taskId, isCompleted];

    const result = await executeQuery(query, values);

    return NextResponse.json({ task: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.log('Error managing task status:', error);
    return NextResponse.json({ error: 'Error managing task status' }, { status: 500 });
  }
};

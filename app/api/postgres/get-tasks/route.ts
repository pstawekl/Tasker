import { executeQuery } from '@/lib/db';
import { Tasks } from '@/lib/models/tasks';
import { NextResponse } from 'next/server';
import { checkTokenFromRequest } from '../../utils/firebaseAdmin';

export const POST = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);
    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { taskListId } = body;
    const query = 'SELECT * FROM tasks where list_id = $1';
    const result = await executeQuery(query, [taskListId]);

    const tasks: Tasks = result.rows;

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
};

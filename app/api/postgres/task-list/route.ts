import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkTokenFromRequest } from '../../utils/firebaseAdmin';

export const POST = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);

    if (!isTokenValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { user_id } = body;
    const result = await executeQuery('SELECT * FROM task_lists where user_id = $1', [user_id]);

    return NextResponse.json({ taskLists: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching task lists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

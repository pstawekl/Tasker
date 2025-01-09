import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkTokenFromRequest } from '../../utils/firebaseAdmin';

export const POST = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);
    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('After token check');
    const body = await req.json();
    const { list_id } = body;

    const query = `
            SELECT * from task_lists where id = $1
        `;
    const values = [list_id];

    const result = await executeQuery(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No task list found' }, { status: 404 });
    }

    return NextResponse.json({ taskList: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching task list:', error);
    return NextResponse.json({ error: 'Error fetching task list' }, { status: 500 });
  }
};

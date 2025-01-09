import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { checkTokenFromRequest } from '../../utils/firebaseAdmin';

export const POST = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);

    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { task_id, reminder_time } = await req.json();

    const query = `
            INSERT INTO reminders (task_id, reminder_time)
            VALUES ($1, $2)
            RETURNING *;
        `;
    const values = [task_id, reminder_time];

    const result = await executeQuery(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding reminder:', error);
    return NextResponse.json({ error: 'Error adding reminder' }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);

    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id, reminder_time } = await req.json();

    const query = `
            UPDATE reminders
            SET reminder_time = $1
            WHERE id = $2
            RETURNING *;
        `;
    const values = [reminder_time, id];

    const result = await executeQuery(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error editing reminder:', error);
    return NextResponse.json({ error: 'Error editing reminder' }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const isTokenValid = await checkTokenFromRequest(req);

    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await req.json();

    const query = `
            DELETE FROM reminders
            WHERE id = $1
            RETURNING *;
        `;
    const values = [id];

    const result = await executeQuery(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reminder deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Error deleting reminder' }, { status: 500 });
  }
};

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { Task } from '@/lib/models/tasks';

export const PUT = async (req: Request) => {
    try {
        const task: Task = await req.json();
        const { id, title, description, due_date } = task;

        const query = `
            UPDATE tasks
            SET title = $1, description = $2, due_date = $3
            WHERE id = $4
            RETURNING *;
        `;

        console.log('Data wykonania: ', due_date);
        const values = [title, description, new Date(due_date).toISOString(), id];

        const result = await executeQuery(query, values);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ task: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Error editing task:', error);
        return NextResponse.json({ error: 'Error editing task' }, { status: 500 });
    }
};

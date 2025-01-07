import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    try {
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

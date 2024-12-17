import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { Tasks } from '@/lib/models/tasks';

export const POST = async (req: Request) => {
    try {
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

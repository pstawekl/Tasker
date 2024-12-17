import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { taskId } = body;

    if (!taskId || isNaN(Number(taskId))) {
        return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    try {
        const result = await executeQuery('SELECT * FROM tasks WHERE id = $1', [taskId]);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json({ task: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json({error: 'Internal server error' }, {status: 500});
    }
}

import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
    try {
        const { id } = await req.json();

        const query = `
            DELETE FROM tasks
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];

        const result = await executeQuery(query, values);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
    }
};
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { list_id } = body;

        const query = `
            SELECT * from task_lists where id = $1
        `;
        const values = [list_id];

        const result = await executeQuery(query, values);

        return NextResponse.json({ taskList: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json({ error: 'Error fetching reminders' }, { status: 500 });
    }
}
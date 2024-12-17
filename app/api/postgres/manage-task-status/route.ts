import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json();
    const { taskId, isCompleted } = body;

    const query = `
        UPDATE tasks
        SET is_completed = $2
        WHERE id = $1
        RETURNING *;
    `;

    const values = [taskId, isCompleted];

    const result = await executeQuery(query, values);

    return NextResponse.json({ task: result.rows[0] }, { status: 200 });
};
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res) => {
    const body = await req.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "task_list_id is required" }, { status: 400 });
    }

    try {
        const query = `
            DELETE FROM task_lists
            WHERE id = $1
            RETURNING *;
        `;

        const result = await executeQuery(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Task list not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task list deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
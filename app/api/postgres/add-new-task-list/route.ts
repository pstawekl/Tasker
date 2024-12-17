import { executeQuery } from "@/lib/db";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const body = await req.json();
        const { name, user_id } = body;

        if (!name || !user_id) {
            return NextResponse.json({ message: "Please fill all the fields" }, { status: 400 });
        }

        const query = `
        INSERT INTO task_lists (name, user_id, created_at)
        VALUES ($1, $2, NOW())
        RETURNING *
    `;

        const values = [name, user_id];

        const result = await executeQuery(query, values);

        return NextResponse.json({ info: result.command }, { status: 201 });
    } catch (error) {
        console.error("Error adding task list:", error);
        return NextResponse.json({ error: "Error adding task list" }, { status: 500 });
    }
}
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { auth0_id } = body;

        const query = `
            SELECT 
                tk.id AS id, 
                tk.list_id AS list_id, 
                tk.title AS title, 
                tk.description AS description, 
                tk.due_date AS due_date, 
                tk.is_completed AS is_completed, 
                tk.created_at AS created_at, 
                tk.updated_at AS updated_at 
            FROM 
                task_lists tl
            LEFT JOIN 
                tasks tk
            ON 
                tl.id = tk.list_id
            LEFT JOIN 
                users usr
            ON
                usr.id = tl.user_id
            WHERE 
                usr.auth0_id = $1;
        `;
        const values = [auth0_id];

        const result = await executeQuery(query, values);

        return NextResponse.json({ tasks: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json({ error: 'Error fetching reminders' }, { status: 500 });
    }
}
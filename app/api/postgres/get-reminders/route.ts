import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";
import { checkTokenFromRequest } from "../../utils/firebaseAdmin";


export const POST = async (req: Request) => {
    try {
        const isTokenValid = await checkTokenFromRequest(req);

        if (!isTokenValid) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const { task_id } = body;

        const query = `
            SELECT id, task_id, reminder_time, is_sent
            FROM reminders
            WHERE task_id = $1
            ORDER BY reminder_time;
        `;
        const values = [task_id];

        const result = await executeQuery(query, values);

        return NextResponse.json({ reminders: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json({ error: 'Error fetching reminders' }, { status: 500 });
    }
};

import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { firebase_id } = body;
        const result = await executeQuery('SELECT * FROM users where firebase_id = $1', [firebase_id]);
        return NextResponse.json({ users: result.rows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

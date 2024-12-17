import { executeQuery } from "@/lib/db";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { auth0_id } = body;
        const result = await executeQuery('SELECT * FROM users where auth0_id = $1', [auth0_id]);
        return NextResponse.json({ users: result.rows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

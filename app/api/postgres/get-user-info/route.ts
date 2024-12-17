import { NextResponse } from 'next/server';
import { executeQuery } from "@/lib/db";

export async function POST(req) {
    try {
        const data = await req.json();
        const { auth0_id } = data;
        const userInfo = await executeQuery(
            'SELECT id, email, username, created_at, picture FROM users WHERE auth0_id = $1',
            [auth0_id]
        );
        return NextResponse.json({ user: userInfo.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

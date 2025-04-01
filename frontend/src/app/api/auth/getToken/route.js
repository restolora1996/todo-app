import { NextResponse } from 'next/server';

export async function GET(req) {
	const token = req.cookies.get('token')?.value; // Reads token from cookies

	if (!token) {
		return NextResponse.json({ message: 'No token found' }, { status: 401 });
	}
	return NextResponse.json({ token }, { status: 200 });
}

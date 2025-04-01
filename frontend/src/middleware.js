import { NextResponse } from 'next/server';

export async function middleware(req) {
	try {
		const token = req.cookies.get('token'); // Check cookiec

		const { pathname } = req.nextUrl;

		// redirect to `/login` even if there's no token
		if (!token && pathname === '/home') {
			console.log('No token found! Redirecting to /login...');
			return NextResponse.redirect(new URL('/login', req.url));
		}

		// Prevent logged-in users from accessing `/task`
		if (!token && pathname.includes('/task')) {
			console.log('No token found! Redirecting to /login...');
			return NextResponse.redirect(new URL('/login', req.url));
		}

		// Prevent logged-in users from accessing `/login`
		if (token && pathname === '/login') {
			console.log('User already logged in! Redirecting to /home...');
			return NextResponse.redirect(new URL('/home', req.url));
		}

		if (token && pathname === '/signup') {
			console.log('User already logged in! Redirecting to /home...');
			return NextResponse.redirect(new URL('/home', req.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.log('middleware:', error);
	}
}

export const config = {
	matcher: ['/home', '/login', '/task/:path*', '/signup'] // Protect these routes
};

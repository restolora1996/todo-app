import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/context/UserContext';
// import { cookies } from 'next/headers';
import { AlertProvider } from '@/context/AlertContext';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata = {
	title: 'Todo App',
	description: 'Todo app'
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<UserProvider>
					{/* {children} */}
					<AlertProvider>{children}</AlertProvider>
				</UserProvider>
			</body>
		</html>
	);
}

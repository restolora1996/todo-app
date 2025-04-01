export function getCookie(name) {
	const cookies = document.cookie.split('; ');
	console.log({ cookies }, document.cookie);
	const cookie = cookies.find(row => row.startsWith(name + '='));
	return cookie ? cookie.split('=')[1] : null;
}

export function openSidebar() {
	if (typeof window !== 'undefined') {
		document.body.style.overflow = 'hidden';
		document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
	}
}

export function closeSidebar() {
	if (typeof window !== 'undefined') {
		document.documentElement.style.removeProperty('--SideNavigation-slideIn');
		document.body.style.removeProperty('overflow');
	}
}

export function toggleSidebar() {
	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		const slideIn = window.getComputedStyle(document.documentElement).getPropertyValue('--SideNavigation-slideIn');
		if (slideIn) {
			closeSidebar();
		} else {
			openSidebar();
		}
	}
}
export const styles = {
	primary: '#272d32',
	secondary: '#818d99',
	dividers: '#c7ced6',
	bgContent: '#f2f8fd',
	white: '#fff',
	mainButtons: '#027CEC',
	critical: '#eb0000',
	high: '#fac300'
};

/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		API: 'http://localhost:5000/api',
		UPLOAD_PATH: 'http://localhost:5000'
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5000', // Update this if your API runs on a different port
				pathname: '/uploads/**'
			}
		]
	}
};

export default nextConfig;

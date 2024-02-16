/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: "img.clerk.com"
        }, {
            protocol: "https",
            hostname: 'social-media-app-7708.s3.amazonaws.com',
        },
        {
            protocol: "https",
            hostname: 'social-media-app-7708.s3.eu-north-1.amazonaws.com',
        },
    ],
      
    }
};

export default nextConfig;

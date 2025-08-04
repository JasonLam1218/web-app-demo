/**
 * Next.js Configuration File
 * 
 * This file configures the Next.js application for the EduAI web application.
 * It includes settings for static export, image optimization, and Material-UI integration.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration - enables static site generation for Azure Static Web Apps
  // Uncomment this line when deploying to Azure Static Web Apps
  // output: 'export', 
  
  // Image optimization settings
  images: { 
    unoptimized: true // Disables Next.js image optimization for static export compatibility
  },
  
  // URL configuration
  trailingSlash: false, // Adds trailing slashes to URLs for better compatibility with static hosting
  
  // Experimental features configuration
  experimental: {
    // Remove appDir if present - not needed in Next.js 15 as App Router is now stable
  },
  
  // Compiler configuration
  compiler: {
    emotion: true, // Enables Emotion CSS-in-JS compilation for Material-UI
  },
  
  // Import optimization for Material-UI icons
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}', // Optimizes Material-UI icon imports
    },
  },
};

module.exports = nextConfig;

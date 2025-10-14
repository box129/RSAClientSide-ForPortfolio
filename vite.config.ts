import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  // Define the repository name for GitHub Pages deployment
  const repoName = '/RSAClientSide-ForPortfolio/';
  
  // Determine if we are building for production deployment
  // We use process.env.VITE_ROUTER_MODE here because mode will be 'development' during npm run dev
  const isGithubPages = process.env.VITE_ROUTER_MODE === 'hash' || mode === 'production';

  return {
    plugins: [react()],
    
    // 🎯 FIX: Set base conditionally.
    // Use the repo name only for the production build; use '/' for local development.
    base: isGithubPages ? repoName : '/', 
  };
});
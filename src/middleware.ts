import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. In rastaon ko "Green Signal" (Public) dein
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk',
  '/manifest.json',    // Added: Isko rasta do!
  '/icons/(.*)'        // Added: Icons ko bhi jane do!
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Agar route public list mein nahi hai, tabhi gate band karein
  if (!isPublicRoute(req)) {
      await auth.protect();
  }
});

export const config = {
  matcher: [
    // 3. Matcher ko thoda "Smart" banayein
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|wav|ogg|mp4|webm)).*)',
    '/(api|trpc)(.*)',
  ],
};
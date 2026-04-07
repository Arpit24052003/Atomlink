import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Make all routes in this array PUBLIC
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, protect it.
  // Wait, actually because everything runs on `/` (SPA), we need `/` to be public.
  // The route protection will be handled at the component level inside the SPA.
  if (!isPublicRoute(req)) {
      await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, including media (mp3, wav, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|wav|ogg|mp4|webm)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

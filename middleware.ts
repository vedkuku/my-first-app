import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public --- everyone can access these
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',       //home page
    '/api/saved-threats(.*)',     // NVD proxy --- public search
]);

export default  clerkMiddleware(async (auth,req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();   // async now - required in latest Clerk
    
    }
});


export const config = {
    matcher: [ 
        // Run middleware on all routes except static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    ],
};
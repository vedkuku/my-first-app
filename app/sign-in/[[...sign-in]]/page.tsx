import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-[#07090F] flex items-center justify-center">
        <SignIn />  {/* Clerk's pre-built sign-in UI */}
      </main> 
    );
}
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <main className="min-h-screen bg-[#07090F] flex items-center justify-center">
        <SignUp />  {/* Clerk's pre-built sign-up UI */}
      </main> 
    );
}
"use client"

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { X } from 'lucide-react';
import { useState } from 'react';

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-[380px] h-[380px]" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
export default function SignUp() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="flex w-full max-w-6xl">
          <div className="flex-shrink-0 w-1/2 flex justify-center items-center">
            <XLogo />
          </div>
          <div className="flex-grow w-1/2 max-w-xl space-y-10">
            <div>
              <h1 className="text-7xl w-full font-bold mb-3">Happening now</h1>
              <h2 className="text-3xl font-bold pt-4">Join today.</h2>
            </div>
            <div className="space-y-3 max-w-sm">
              <SignUpButton mode="modal">
                <button className="w-full bg-white text-black border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center font-bold text-sm hover:bg-gray-50">
                  <svg width="20" height="20" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className="mr-2">
                    <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" />
                    <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" />
                    <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" />
                    <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" />
                  </svg>
                  Sign up with Google
                </button>
              </SignUpButton>
              <div className="flex items-center my-2">
                <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                <span className="px-4 text-sm">or</span>
                <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <SignUpButton mode="modal">
                <button className="w-full bg-[#1d9bf0] text-white rounded-full py-2 px-4 font-bold text-sm hover:bg-[#1a8cd8]">
                  Create account
                </button>
              </SignUpButton>
              <p className={`text-[11px] ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} leading-tight`}>
                By signing up, you agree to the <a href="#" className="text-[#1d9bf0]">Terms of Service</a> and <a href="#" className="text-[#1d9bf0]">Privacy Policy</a>, including <a href="#" className="text-[#1d9bf0]">Cookie Use</a>.
              </p>
            </div>
            <div className="space-y-3 max-w-sm">
              <p className="font-bold text-lg">Already have an account?</p>
              <SignInButton mode="modal">
                <button className={`w-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} text-[#1d9bf0] rounded-full py-2 px-4 font-bold text-sm hover:bg-[#1d9bf0]/10 transition-colors`}>
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </main>
      <footer className={`${isDarkMode ? 'bg-[#16181c]' : 'bg-gray-100'} py-3 px-4 flex items-center justify-between text-xs`}>
        <p>Welcome to x.com!</p>
        <p className="max-w-xl">
          We are letting you know that we are changing our URL, but your privacy and data protection settings remain the same.
          For more details, see our Privacy Policy: <a href="https://x.com/en/privacy" className="text-[#1d9bf0]">https://x.com/en/privacy</a>
        </p>
        <button
          className={`${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'} p-1 rounded-full transition-colors`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <X size={16} />
        </button>
      </footer>
    </div>
  )
}
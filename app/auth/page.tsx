'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { signIn } from '@/auth/sign-in';
import { signUp } from '@/auth/sign-up';
import { useRouter } from 'next/navigation';
import { authClient } from '@/auth/auth-client';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

const AuthForm = dynamic(() => import('./AuthForm'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded-md"></div>
      <div className="h-10 bg-gray-200 rounded-md"></div>
      <div className="h-10 bg-gray-200 rounded-md"></div>
    </div>
  ),
});

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
 
  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await authClient.getSession();
      if (session) {
        router.push('/marketplace');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message ?? 'Authentication failed');
          return;
        }
        router.push('/marketplace');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.name || formData.email.split('@')[0]
        );
        if (error) {
          setError(error.message ?? 'Registration failed');
          return;
        }
        router.push('/marketplace');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dreamy-gradient">
      <div className="flex w-full max-w-6xl bg-gray-100 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden h-[500px] md:h-[600px] lg:h-[700px] transition-all duration-300">
        {/* Left: Login Card */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-10 py-14">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-8">
              <Image
                src="/next.svg"
                alt="KyndSpace Logo"
                width={70}
                height={70}
                className="mb-2"
                priority
              />
              <h2 className="text-base text-gray-400 tracking-widest font-medium mb-2">Welcome Back</h2>
              <p className="text-md font-semibold text-gray-500 mb-1 text-center">
                {isLogin ? 'Please enter your credentials to sign in.' : 'Create your account to get started.'}
              </p>
            </div>
            
            <AuthForm
              isLogin={isLogin}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-400" />
              <span className="mx-2 text-sm text-gray-400">or continue with</span>
              <div className="flex-grow border-t border-gray-400" />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-gray-700 bg-white/70 hover:bg-sky-100/60 hover:cursor-pointer transition shadow-sm" aria-label="Sign in with Discord">
                <FaDiscord className="w-5 h-5 text-indigo-500" />
                Discord
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-gray-700 bg-white/70 hover:bg-pink-100/60 hover:cursor-pointer transition shadow-sm" aria-label="Sign in with Google">
                <FaGoogle className="w-5 h-5 text-red-500" />
                Google
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-700 hover:text-gray-900 hover:cursor-pointer font-medium transition"
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
          <div className="w-full h-full flex items-center justify-center p-2">
            <Image
              src="/content/auth.jpg"
              alt="Robot"
              className="object-cover w-full h-full rounded-3xl shadow-xl"
              width={800}
              height={800}
              priority
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center px-8 py-4 text-md font-bold text-gray-100 tracking-widest select-none mt-8 absolute left-0 bottom-0 ">
        <span className="mb-2 md:mb-0">HEX</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

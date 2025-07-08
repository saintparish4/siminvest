'use client';

interface AuthFormProps {
  isLogin: boolean;
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export default function AuthForm({
  isLogin,
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
}: AuthFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <input
        id="email"
        name="email"
        type="email"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-200 bg-white/80 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 shadow-sm focus:shadow-md sm:text-sm transition"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        id="password"
        name="password"
        type="password"
        required
        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-200 bg-white/80 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 shadow-sm focus:shadow-md sm:text-sm transition"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {!isLogin && (
        <>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-200 bg-white/80 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 shadow-sm focus:shadow-md sm:text-sm transition"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <input
            id="name"
            name="name"
            type="text"
            required
            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-200 bg-white/80 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 shadow-sm focus:shadow-md sm:text-sm transition"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
          />
        </>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-gradient-to-r from-sky-400 via-pink-200 to-teal-300 hover:brightness-110 hover:scale-105 text-gray-900 font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 hover:cursor-pointer transition-all"
      >
        {isLoading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
      </button>
    </form>
  );
} 
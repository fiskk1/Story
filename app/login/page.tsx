'use client';

import { FormEvent, useState } from 'react';
import { setToken } from '@/lib/client-auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
    });
    const json = await res.json();
    if (!res.ok) return setError(json.error || 'Login failed');
    setToken(json.token);
    router.push('/');
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <form className="card space-y-3" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">Login</h1>
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input className="input" name="password" type="password" placeholder="Password" required />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Sign In
        </button>
      </form>
    </main>
  );
}

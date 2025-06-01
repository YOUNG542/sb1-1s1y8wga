// src/components/Login.tsx
import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';

export function Login({ onLogin }: { onLogin: (user: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNew] = useState(false);

  const handleAuth = async () => {
    try {
      const userCred = isNew
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      const userEmail = userCred.user.email || 'Anonymous';
      onLogin(userEmail);
      localStorage.setItem('userEmail', userEmail);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">
        {isNew ? 'Sign Up' : 'Login'}
      </h2>
      <input
        className="mb-2 p-2 border w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 p-2 border w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleAuth}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        {isNew ? 'Create Account' : 'Log In'}
      </button>
      <p
        onClick={() => setIsNew(!isNew)}
        className="text-sm mt-3 text-blue-600 cursor-pointer hover:underline"
      >
        {isNew ? 'Already have an account? Log in' : 'No account? Sign up'}
      </p>
    </div>
  );
}

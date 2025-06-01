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

      const userEmail = userCred.user.email || '익명';
      onLogin(userEmail);
      localStorage.setItem('userEmail', userEmail);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-md mx-auto text-center border-l-8 border-red-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {isNew ? '계정 만들기' : '로그인'}
      </h2>

      <input
        className="mb-3 p-3 border w-full rounded-md focus:ring-red-500 focus:border-red-500"
        type="email"
        placeholder="이메일 주소 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 p-3 border w-full rounded-md focus:ring-red-500 focus:border-red-500"
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleAuth}
        className="bg-red-600 text-white w-full py-3 rounded-md font-semibold hover:bg-red-700 transition-colors"
      >
        {isNew ? '가입하기' : '로그인'}
      </button>

      <p
        onClick={() => setIsNew(!isNew)}
        className="text-sm mt-4 text-red-600 cursor-pointer hover:underline"
      >
        {isNew
          ? '이미 계정이 있으신가요? 로그인하기'
          : '계정이 없으신가요? 지금 가입'}
      </p>
    </div>
  );
}
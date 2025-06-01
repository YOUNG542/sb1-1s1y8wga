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
  const [agreed, setAgreed] = useState(false); // 개인정보 동의 상태

  const handleAuth = async () => {
    if (isNew && !agreed) {
      alert('개인정보 수집 및 이용에 동의하셔야 회원가입이 가능합니다.');
      return;
    }

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
    <div className="p-6 bg-white rounded-lg shadow max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">
        {isNew ? '회원가입' : '로그인'}
      </h2>

      <input
        className="mb-2 p-2 border w-full"
        type="email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 p-2 border w-full"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isNew && (
        <div className="flex items-start text-left mb-4">
          <input
            id="agreement"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 mr-2"
          />
          <label htmlFor="agreement" className="text-sm text-gray-700">
            <span className="font-medium">[필수]</span> 본인은 본 서비스가 입력한 이메일 정보를
            사용자 인증 및 간단한 통계 목적에 사용함에 동의합니다.
          </label>
        </div>
      )}

      <button
        onClick={handleAuth}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        {isNew ? '계정 만들기' : '로그인'}
      </button>

      <p
        onClick={() => setIsNew(!isNew)}
        className="text-sm mt-3 text-blue-600 cursor-pointer hover:underline"
      >
        {isNew
          ? '이미 계정이 있으신가요? 로그인'
          : '아직 계정이 없으신가요? 회원가입'}
      </p>
    </div>
  );
}

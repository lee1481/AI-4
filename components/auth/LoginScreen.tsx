
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    if (email && password) {
      onLogin();
    } else {
      alert('이메일과 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-light flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-navy">AI 영업 비서</h1>
          <p className="mt-2 text-gray-text">로그인하여 대시보드를 확인하세요.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-navy focus:border-navy focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-navy focus:border-navy focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-navy hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy"
            >
              로그인
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button onClick={onNavigateToSignUp} className="font-medium text-orange-accent hover:text-orange-500">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;

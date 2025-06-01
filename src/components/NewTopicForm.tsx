import React, { useState } from 'react';
import { Topic } from '../types';

interface NewTopicFormProps {
  onSubmit: (topic: Omit<Topic, 'id' | 'createdAt'>) => void;
}

export function NewTopicForm({ onSubmit }: NewTopicFormProps) {
  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      optionA,
      optionB,
      author: '익명', // MVP 단계에서는 익명으로 작성
    });
    setTitle('');
    setOptionA('');
    setOptionB('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">새 질문 만들기</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            질문 내용
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="예: 차라리 월세 살기 vs 반지하 자가"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="optionA" className="block text-sm font-medium text-gray-700 mb-1">
              선택지 A
            </label>
            <input
              type="text"
              id="optionA"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="optionB" className="block text-sm font-medium text-gray-700 mb-1">
              선택지 B
            </label>
            <input
              type="text"
              id="optionB"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          질문 등록하기
        </button>
      </div>
    </form>
  );
}

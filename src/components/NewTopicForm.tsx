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
      author: '익명',
    });
    setTitle('');
    setOptionA('');
    setOptionB('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-l-8 border-red-500 rounded-xl shadow-md p-6 mb-10">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
        새로운 논쟁 주제 만들기
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-800 mb-1">
            주제 (예: 어떤 삶이 더 나은가?)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            placeholder="예: 월세 살기 vs 반지하 자가"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="optionA" className="block text-sm font-bold text-gray-800 mb-1">
              선택지 A
            </label>
            <input
              type="text"
              id="optionA"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="w-full px-4 py-2 border border-blue-500 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="선택지 A를 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="optionB" className="block text-sm font-bold text-gray-800 mb-1">
              선택지 B
            </label>
            <input
              type="text"
              id="optionB"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="w-full px-4 py-2 border border-red-500 rounded-md focus:ring-red-600 focus:border-red-600"
              placeholder="선택지 B를 입력하세요"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-bold text-lg hover:bg-red-700 transition-colors"
        >
          질문 등록하기
        </button>
      </div>
    </form>
  );
}

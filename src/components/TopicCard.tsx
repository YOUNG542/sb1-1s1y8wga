import React, { useState } from 'react';
import { Topic } from '../types';
import { MessageSquare } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onVote: (choice: 'A' | 'B') => void;
  totalVotesA: number;
  totalVotesB: number;
  onDiscuss: () => void;
}

export function TopicCard({
  topic,
  onVote,
  totalVotesA,
  totalVotesB,
  onDiscuss,
}: TopicCardProps) {
  const [votedOption, setVotedOption] = useState<'A' | 'B' | null>(() => {
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      const votes = JSON.parse(savedVotes);
      return votes[topic.id] || null;
    }
    return null;
  });

  const total = totalVotesA + totalVotesB;
  const percentageA = total > 0 ? Math.round((totalVotesA / total) * 100) : 0;
  const percentageB = total > 0 ? Math.round((totalVotesB / total) * 100) : 0;

  const handleVote = (choice: 'A' | 'B') => {
    if (votedOption === null) {
      setVotedOption(choice);
      onVote(choice);

      const savedVotes = localStorage.getItem('userVotes');
      const votes = savedVotes ? JSON.parse(savedVotes) : {};
      votes[topic.id] = choice;
      localStorage.setItem('userVotes', JSON.stringify(votes));
    }
  };

  return (
    <div className="bg-white border-l-8 border-red-500 rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">
        {topic.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleVote('A')}
          disabled={votedOption !== null}
          className={`p-6 text-xl font-semibold rounded-lg transition-all duration-300 transform text-white shadow-md
            ${votedOption === 'A'
              ? 'bg-blue-700 scale-105 ring-4 ring-blue-300'
              : votedOption === 'B'
              ? 'bg-gray-200 text-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}
          `}
        >
          {topic.optionA}
          <div className="text-sm mt-2 font-normal">
            {percentageA}% ({totalVotesA}표)
          </div>
        </button>

        <button
          onClick={() => handleVote('B')}
          disabled={votedOption !== null}
          className={`p-6 text-xl font-semibold rounded-lg transition-all duration-300 transform text-white shadow-md
            ${votedOption === 'B'
              ? 'bg-red-700 scale-105 ring-4 ring-red-300'
              : votedOption === 'A'
              ? 'bg-gray-200 text-gray-400'
              : 'bg-red-600 hover:bg-red-700 hover:scale-105'}
          `}
        >
          {topic.optionB}
          <div className="text-sm mt-2 font-normal">
            {percentageB}% ({totalVotesB}표)
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>작성자: 익명</div>
        <button
          onClick={onDiscuss}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
        >
          <MessageSquare className="w-4 h-4" /> 댓글 보기
        </button>
      </div>
    </div>
  );
}
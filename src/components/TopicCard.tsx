import React, { useState, useEffect } from 'react';
import { Topic } from '../types';
import { MessageCircle, Star } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onVote: (choice: 'A' | 'B') => void;
  totalVotesA: number;
  totalVotesB: number;
  commentCount: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDiscuss: () => void;
}

export function TopicCard({
  topic,
  onVote,
  totalVotesA,
  totalVotesB,
  commentCount,
  isFavorite,
  onToggleFavorite,
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
    if (votedOption === null || votedOption !== choice) {
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
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-extrabold text-gray-900">{topic.title}</h2>
        <button
          onClick={onToggleFavorite}
          className={`ml-2 p-1 rounded ${isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
          aria-label="관심 등록"
        >
          <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <button
          onClick={() => handleVote('A')}
          className={`p-4 text-lg font-semibold rounded-lg transition-all duration-300 transform text-white shadow-md ${
            votedOption === 'A'
              ? 'bg-blue-700 scale-105 ring-4 ring-blue-300'
              : votedOption === 'B'
              ? 'bg-gray-200 text-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
          }`}
        >
          {topic.optionA}
          <div className="text-sm mt-2 font-normal">
            {percentageA}% ({totalVotesA}표)
          </div>
        </button>

        <button
          onClick={() => handleVote('B')}
          className={`p-4 text-lg font-semibold rounded-lg transition-all duration-300 transform text-white shadow-md ${
            votedOption === 'B'
              ? 'bg-red-700 scale-105 ring-4 ring-red-300'
              : votedOption === 'A'
              ? 'bg-gray-200 text-gray-400'
              : 'bg-red-600 hover:bg-red-700 hover:scale-105'
          }`}
        >
          {topic.optionB}
          <div className="text-sm mt-2 font-normal">
            {percentageB}% ({totalVotesB}표)
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <button
          onClick={onDiscuss}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold"
        >
          <MessageCircle className="w-4 h-4" /> 댓글 {commentCount}
        </button>
        <span>작성자: {topic.author || '익명'}</span>
      </div>
    </div>
  );
}

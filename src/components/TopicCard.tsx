import React, { useState, useEffect } from 'react';
import { Topic } from '../types';
import { MessageSquare } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onVote: (choice: 'A' | 'B') => void;
  totalVotesA: number;
  totalVotesB: number;
  onDiscuss: () => void;
}

export function TopicCard({ topic, onVote, totalVotesA, totalVotesB, onDiscuss }: TopicCardProps) {
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
      
      // Save vote to localStorage
      const savedVotes = localStorage.getItem('userVotes');
      const votes = savedVotes ? JSON.parse(savedVotes) : {};
      votes[topic.id] = choice;
      localStorage.setItem('userVotes', JSON.stringify(votes));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{topic.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleVote('A')}
          disabled={votedOption !== null}
          className={`p-4 rounded-lg transition-all duration-300 transform ${
            votedOption === 'A'
              ? 'bg-blue-100 scale-105 ring-2 ring-blue-500'
              : votedOption === 'B'
              ? 'bg-gray-50 opacity-75'
              : 'bg-blue-50 hover:bg-blue-100 hover:scale-102'
          }`}
        >
          <div className="font-semibold text-blue-700 mb-2">{topic.optionA}</div>
          <div className="text-sm text-blue-600">
            {percentageA}% ({totalVotesA} votes)
          </div>
        </button>

        <button
          onClick={() => handleVote('B')}
          disabled={votedOption !== null}
          className={`p-4 rounded-lg transition-all duration-300 transform ${
            votedOption === 'B'
              ? 'bg-purple-100 scale-105 ring-2 ring-purple-500'
              : votedOption === 'A'
              ? 'bg-gray-50 opacity-75'
              : 'bg-purple-50 hover:bg-purple-100 hover:scale-102'
          }`}
        >
          <div className="font-semibold text-purple-700 mb-2">{topic.optionB}</div>
          <div className="text-sm text-purple-600">
            {percentageB}% ({totalVotesB} votes)
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
      <div>Posted by Anonymous</div>
        <button
          onClick={onDiscuss}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <MessageSquare className="w-4 h-4" />
          Discuss
        </button>
      </div>
    </div>
  );
}
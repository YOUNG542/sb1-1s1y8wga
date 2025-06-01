import React from 'react';
import { Comment, Vote } from '../types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface CommentCardProps {
  comment: Comment;
  onVote: (commentId: string, vote: Vote) => void;
}

export function CommentCard({ comment, onVote }: CommentCardProps) {
  return (
    <div className="bg-white border-l-4 border-gray-400 rounded-lg p-4 shadow-sm mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-800">익명</span>
            {comment.choice && (
  <span
    className={`text-xs px-2 py-1 rounded-full font-semibold text-white
      ${comment.choice === 'A' ? 'bg-blue-600' : 'bg-red-600'}`}
  >
    선택 {comment.choice}
  </span>
)}

          </div>
          <p className="text-gray-900 leading-snug whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>

        <div className="flex flex-col items-center justify-start gap-1">
          <button
            onClick={() => onVote(comment.id, 'up')}
            className="hover:text-blue-600 text-gray-500"
            aria-label="좋아요"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700">{comment.votes}</span>
          <button
            onClick={() => onVote(comment.id, 'down')}
            className="hover:text-red-600 text-gray-500"
            aria-label="싫어요"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
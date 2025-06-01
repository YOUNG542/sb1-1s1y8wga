import React from 'react';
import { Comment, Vote } from '../types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface CommentCardProps {
  comment: Comment;
  onVote: (commentId: string, vote: Vote) => void;
}

export function CommentCard({ comment, onVote }: CommentCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">익명</span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
              선택 {comment.choice === 'A' ? 'A' : 'B'}
            </span>
          </div>
          <p className="text-gray-800">{comment.text}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote(comment.id, 'up')}
            className="p-1 hover:text-blue-600 transition-colors"
            aria-label="좋아요"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">{comment.votes}</span>
          <button
            onClick={() => onVote(comment.id, 'down')}
            className="p-1 hover:text-red-600 transition-colors"
            aria-label="싫어요"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

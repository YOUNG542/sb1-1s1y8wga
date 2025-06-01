import React, { useState, useEffect, useMemo } from 'react';
import { Topic, Comment, Vote } from './types';
import { TopicCard } from './components/TopicCard';
import { CommentCard } from './components/CommentCard';
import { NewTopicForm } from './components/NewTopicForm';
import { Login } from './components/Login';

function App() {
  const [topics, setTopics] = useState<Topic[]>(() => {
    const savedTopics = localStorage.getItem('topics');
    return savedTopics
      ? JSON.parse(savedTopics).map((topic: any) => ({
          ...topic,
          createdAt: new Date(topic.createdAt),
        }))
      : [];
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments
      ? JSON.parse(savedComments).map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        }))
      : [];
  });

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [newComment, setNewComment] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });

  useEffect(() => {
    localStorage.setItem('topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleNewTopic = (topicData: Omit<Topic, 'id' | 'createdAt'>) => {
    if (!userEmail) return;
    const newTopic: Topic = {
      ...topicData,
      id: Date.now().toString(),
      createdAt: new Date(),
      author: userEmail,
    };
    setTopics([newTopic, ...topics]);
  };

  const handleVote = (topicId: string, choice: 'A' | 'B') => {
    if (!userEmail) return;
    const vote: Comment = {
      id: Date.now().toString(),
      topicId,
      text: `Voted for option ${choice}`,
      author: userEmail,
      choice,
      createdAt: new Date(),
      votes: 0,
    };
    setComments([vote, ...comments]);
  };

  const handleCommentVote = (commentId: string, vote: Vote) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            votes: comment.votes + (vote === 'up' ? 1 : -1),
          };
        }
        return comment;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !newComment.trim() || !userEmail) return;

    const comment: Comment = {
      id: Date.now().toString(),
      topicId: selectedTopic.id,
      text: newComment,
      author: userEmail,
      createdAt: new Date(),
      votes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const voteCounts = useMemo(() => {
    const counts: Record<string, { votesA: number; votesB: number }> = {};
    topics.forEach((topic) => {
      const votes = comments.filter(
        (c) =>
          c.topicId === topic.id &&
          c.text.startsWith('Voted for option') &&
          (c.choice === 'A' || c.choice === 'B')
      );
      const votesA = votes.filter((c) => c.choice === 'A').length;
      const votesB = votes.filter((c) => c.choice === 'B').length;
      counts[topic.id] = { votesA, votesB };
    });
    return counts;
  }, [topics, comments]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Would You Rather?
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!userEmail ? (
          <Login onLogin={setUserEmail} />
        ) : selectedTopic ? (
          <div>
            <button
              onClick={() => setSelectedTopic(null)}
              className="mb-4 text-blue-600 hover:text-blue-700"
            >
              ← Back to topics
            </button>

            <TopicCard
              topic={selectedTopic}
              onVote={(choice) => handleVote(selectedTopic.id, choice)}
              totalVotesA={voteCounts[selectedTopic.id]?.votesA || 0}
              totalVotesB={voteCounts[selectedTopic.id]?.votesB || 0}
              onDiscuss={() => {}}
            />

            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add your comment..."
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Post Comment
              </button>
            </form>

            <div className="space-y-4">
              {comments
                .filter(
                  (c) =>
                    c.topicId === selectedTopic.id &&
                    !c.text.startsWith('Voted for option')
                )
                .map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onVote={handleCommentVote}
                  />
                ))}
            </div>
          </div>
        ) : (
          <>
            <NewTopicForm onSubmit={handleNewTopic} />

            <div>
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onVote={(choice) => handleVote(topic.id, choice)}
                  totalVotesA={voteCounts[topic.id]?.votesA || 0}
                  totalVotesB={voteCounts[topic.id]?.votesB || 0}
                  onDiscuss={() => setSelectedTopic(topic)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useMemo } from 'react';
import { Topic, Comment, Vote } from './types';
import { TopicCard } from './components/TopicCard';
import { CommentCard } from './components/CommentCard';
import { NewTopicForm } from './components/NewTopicForm';
import { Login } from './components/Login';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [newComment, setNewComment] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });
  const [votedTopics, setVotedTopics] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem('votedTopics');
    return stored ? JSON.parse(stored) : {};
  });
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('likedComments');
    return stored ? JSON.parse(stored) : {};
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'topics'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...(doc.data() as Topic),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        }));
        setTopics(data);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'comments'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...(doc.data() as Comment),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        }));
        setComments(data);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleNewTopic = async (topicData: Omit<Topic, 'id' | 'createdAt'>) => {
    if (!userEmail) return;
    await addDoc(collection(db, 'topics'), {
      ...topicData,
      author: userEmail,
      createdAt: serverTimestamp(),
    });
  };

  const handleVote = async (topicId: string, choice: 'A' | 'B') => {
    if (!userEmail) return;

    const prevChoice = votedTopics[topicId];
    const existingVoteComment = comments.find(
      (c) =>
        c.topicId === topicId &&
        c.text.startsWith('선택') &&
        c.author === userEmail
    );

    if (existingVoteComment) {
      await deleteDoc(doc(db, 'comments', existingVoteComment.id));
    }

    await addDoc(collection(db, 'comments'), {
      topicId,
      text: `선택 ${choice}에 투표함`,
      author: userEmail,
      choice,
      createdAt: serverTimestamp(),
      votes: 0,
    });

    const updated = { ...votedTopics, [topicId]: choice };
    setVotedTopics(updated);
    localStorage.setItem('votedTopics', JSON.stringify(updated));
  };

  const handleCommentVote = (commentId: string, vote: Vote) => {
    const alreadyLiked = likedComments[commentId];
    const updatedLiked = { ...likedComments };

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newVotes = comment.votes + (alreadyLiked ? (vote === 'up' ? -1 : 1) : (vote === 'up' ? 1 : -1));
          return {
            ...comment,
            votes: newVotes,
          };
        }
        return comment;
      })
    );

    if (alreadyLiked) {
      delete updatedLiked[commentId];
    } else {
      updatedLiked[commentId] = true;
    }

    setLikedComments(updatedLiked);
    localStorage.setItem('likedComments', JSON.stringify(updatedLiked));
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !newComment.trim() || !userEmail) return;

    await addDoc(collection(db, 'comments'), {
      topicId: selectedTopic.id,
      text: newComment,
      author: userEmail,
      createdAt: serverTimestamp(),
      votes: 0,
    });
    setNewComment('');
  };

  const toggleFavorite = (topicId: string) => {
    const updated = new Set(favorites);
    if (updated.has(topicId)) {
      updated.delete(topicId);
    } else {
      updated.add(topicId);
    }
    setFavorites(updated);
  };

  const voteCounts = useMemo(() => {
    const counts: Record<string, { votesA: number; votesB: number; comments: number }> = {};
    topics.forEach((topic) => {
      const topicComments = comments.filter((c) => c.topicId === topic.id);
      const votes = topicComments.filter(
        (c) => c.text.startsWith('선택') && (c.choice === 'A' || c.choice === 'B')
      );
      const votesA = votes.filter((c) => c.choice === 'A').length;
      const votesB = votes.filter((c) => c.choice === 'B').length;
      const commentsOnly = topicComments.filter((c) => !c.text.startsWith('선택')).length;
      counts[topic.id] = { votesA, votesB, comments: commentsOnly };
    });
    return counts;
  }, [topics, comments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-4 border-red-500 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            밸런스 게임 - 너의 선택은?
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            논쟁을 유도하는 양자택일, 익명으로 선택하고 말해보세요
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {!userEmail ? (
          <Login onLogin={setUserEmail} />
        ) : selectedTopic ? (
          <div>
            <button
              onClick={() => setSelectedTopic(null)}
              className="mb-4 text-sm text-red-600 hover:text-red-700"
            >
              ← 질문 목록으로 돌아가기
            </button>

            <TopicCard
              topic={selectedTopic}
              onVote={(choice) => handleVote(selectedTopic.id, choice)}
              totalVotesA={voteCounts[selectedTopic.id]?.votesA || 0}
              totalVotesB={voteCounts[selectedTopic.id]?.votesB || 0}
              commentCount={voteCounts[selectedTopic.id]?.comments || 0}
              isFavorite={favorites.has(selectedTopic.id)}
              onToggleFavorite={() => toggleFavorite(selectedTopic.id)}
              onDiscuss={() => {}}
            />

            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="당신의 의견을 남겨보세요..."
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                댓글 작성
              </button>
            </form>

            <div className="space-y-4">
              {comments
                .filter(
                  (c) =>
                    c.topicId === selectedTopic.id &&
                    !c.text.startsWith('선택')
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

            <div className="space-y-6">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onVote={(choice) => handleVote(topic.id, choice)}
                  totalVotesA={voteCounts[topic.id]?.votesA || 0}
                  totalVotesB={voteCounts[topic.id]?.votesB || 0}
                  commentCount={voteCounts[topic.id]?.comments || 0}
                  isFavorite={favorites.has(topic.id)}
                  onToggleFavorite={() => toggleFavorite(topic.id)}
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
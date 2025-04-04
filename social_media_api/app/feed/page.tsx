'use client';

import { useEffect, useState } from 'react';
import { Post, User, getUsers, getAllPosts, getCommentsByPostId } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface PostWithCommentCount extends Post {
  commentCount: number;
}

interface UserMap {
  [key: string]: User;
}

export default function Feed() {
  const [posts, setPosts] = useState<PostWithCommentCount[]>([]);
  const [userMap, setUserMap] = useState<UserMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      // Fetch all users for displaying names
      const usersData = await getUsers();
      const usersMap: UserMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });
      setUserMap(usersMap);
      
      // Fetch posts from all users
      const allPostsData = await getAllPosts(Object.keys(usersMap));
      
      // Fetch comment counts for each post
      const postsWithCommentCounts = await Promise.all(
        allPostsData.map(async (post) => {
          const comments = await getCommentsByPostId(post.id);
          return {
            ...post,
            commentCount: comments.length,
          };
        })
      );
      
      // Sort posts by newest first (assuming newer posts have higher IDs)
      const sortedPosts = postsWithCommentCounts.sort((a, b) => b.id - a.id);
      
      setPosts(sortedPosts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    
    // Poll for new posts every 30 seconds
    const interval = setInterval(() => {
      fetchFeed();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchFeed();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
        <button 
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No posts found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              user={userMap[post.userid.toString()]} 
              commentCount={post.commentCount}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
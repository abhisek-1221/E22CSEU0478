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

export default function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState<PostWithCommentCount[]>([]);
  const [userMap, setUserMap] = useState<UserMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [maxCommentCount, setMaxCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all users and create a map for quick lookups
        const usersData = await getUsers();
        const usersMap: UserMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        setUserMap(usersMap);
        
        // Fetch all posts from all users
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
        
        // Find the maximum comment count
        let maxCount = 0;
        postsWithCommentCounts.forEach(post => {
          if (post.commentCount > maxCount) {
            maxCount = post.commentCount;
          }
        });
        setMaxCommentCount(maxCount);
        
        // Filter for posts with the maximum comment count
        const postsWithMaxComments = postsWithCommentCounts.filter(
          post => post.commentCount === maxCount && maxCount > 0
        );
        
        setTrendingPosts(postsWithMaxComments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trending posts:', err);
        setError('Failed to load trending posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (trendingPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-6">Trending Posts</h1>
        <p className="text-gray-600">No trending posts found. Check back later!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trending Posts</h1>
      <p className="text-gray-600 mb-4">Posts with the highest number of comments ({maxCommentCount} comments)</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {trendingPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            user={userMap[post.userid.toString()]} 
            commentCount={post.commentCount}
            isTrending={true}
          />
        ))}
      </div>
    </div>
  );
} 
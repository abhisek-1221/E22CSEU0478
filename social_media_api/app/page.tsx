'use client';

import { useEffect, useState } from 'react';
import { User, getUsers, getPostsByUserId } from './services/api';
import UserCard from './components/UserCard';
import LoadingSpinner from './components/LoadingSpinner';
import { log } from 'node:console';

interface UserWithPostCount extends User {
  postCount: number;
}

export default function TopUsers() {
  const [users, setUsers] = useState<UserWithPostCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        // Fetch all users
        const usersData = await getUsers();
        console.log(usersData);
        
        
        // Fetch post counts for each user
        const usersWithPostCounts = await Promise.all(
          usersData.map(async (user) => {
            const posts = await getPostsByUserId(user.id);
            return {
              ...user,
              postCount: posts.length,
            };
          })
        );
        
        // Sort users by post count (descending) and take top 5
        const topUsers = usersWithPostCounts
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);
        
        setUsers(topUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top users:', err);
        setError('Failed to load top users. Please try again later.');
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Top 5 Users with Most Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => (
          <div key={user.id} className="relative">
            <UserCard user={user} postCount={user.postCount} rank={index + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

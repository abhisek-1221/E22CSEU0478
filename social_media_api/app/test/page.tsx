'use client';

import { useState, useEffect } from 'react';
import { getUsers } from '../services/api';

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Test page: Fetching users');
        const usersData = await getUsers();
        console.log('Test page: Users data received', usersData);
        
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Test page: Error fetching data:', err);
        setError('Failed to fetch data. Check console for details.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      {loading && <p className="text-blue-500">Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>API Connection Successful!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <p className="font-bold">{user.name}</p>
                <p className="text-gray-500">ID: {user.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
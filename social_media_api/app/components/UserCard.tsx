import Image from 'next/image';
import { User } from '../services/api';
import { getUserAvatar, getRandomColor } from '../utils/imageUtils';

interface UserCardProps {
  user: User;
  postCount: number;
  rank?: number;
}

export default function UserCard({ user, postCount, rank }: UserCardProps) {
  const avatarUrl = getUserAvatar(user.id);
  const colorClass = getRandomColor(user.id);
  
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${colorClass} hover:shadow-lg transition-shadow duration-300`}>
      <div className="p-5">
        {rank && (
          <div className="absolute -top-2 -left-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {rank}
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white">
            <Image 
              src={avatarUrl} 
              alt={`${user.name} avatar`}
              className="object-cover"
              fill
              sizes="56px"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">User ID: {user.id}</p>
            <div className="mt-1 bg-white bg-opacity-50 px-2 py-1 rounded-full inline-block">
              <span className="font-medium">{postCount}</span> Posts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
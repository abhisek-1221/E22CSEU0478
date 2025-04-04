import Image from 'next/image';
import { Post, User } from '../services/api';
import { getPostImage, getUserAvatar } from '../utils/imageUtils';

interface PostCardProps {
  post: Post;
  user?: User;
  commentCount: number;
  isTrending?: boolean;
}

export default function PostCard({ post, user, commentCount, isTrending = false }: PostCardProps) {
  const postImageUrl = getPostImage(post.id);
  const avatarUrl = user ? getUserAvatar(user.id) : getUserAvatar(post.userid.toString());
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {isTrending && (
        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1">
          TRENDING
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={avatarUrl}
              alt="User avatar"
              className="object-cover"
              fill
              sizes="40px"
              unoptimized 
            />
          </div>
          <div>
            <h3 className="font-semibold">{user ? user.name : `User ${post.userid}`}</h3>
            <p className="text-xs text-gray-500">Post ID: {post.id}</p>
          </div>
        </div>
        <p className="mb-3 text-gray-700">{post.content}</p>
        <div className="relative h-48 mb-3 overflow-hidden rounded-md">
          <Image
            src={postImageUrl}
            alt="Post image"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {commentCount} Comments
          </span>
        </div>
      </div>
    </div>
  );
}
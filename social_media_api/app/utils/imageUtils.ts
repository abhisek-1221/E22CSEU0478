export const getUserAvatar = (userId: string): string => {
  // Using DiceBear for random avatars
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
};

export const getPostImage = (postId: number): string => {
  // Using Picsum for random post images
  return `https://picsum.photos/seed/${postId}/400/300`;
};

export const getRandomColor = (userId: string): string => {
  const colors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-red-100',
    'bg-orange-100',
    'bg-teal-100',
    'bg-cyan-100',
  ];
  
  const index = parseInt(userId, 10) % colors.length;
  return colors[Math.abs(index)];
}; 
const BASE_URL = '/api';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNzQyNjUxLCJpYXQiOjE3NDM3NDIzNTEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY0OTcxYTYzLTUyNWEtNGYyNy05OTk4LTAxY2Q5YzAwOWY4NCIsInN1YiI6ImUyMmNzZXUwNDc4QGJlbm5ldHQuZWR1LmluIn0sImVtYWlsIjoiZTIyY3NldTA0NzhAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoiYWJoaXNlayBzYWhvbyIsInJvbGxObyI6ImUyMmNzZXUwNDc4IiwiYWNjZXNzQ29kZSI6InJ0Q0haSiIsImNsaWVudElEIjoiZjQ5NzFhNjMtNTI1YS00ZjI3LTk5OTgtMDFjZDljMDA5Zjg0IiwiY2xpZW50U2VjcmV0IjoiVWVoWGFhbVJ4VUZlWW5SZiJ9.Xe-ivOSGUD7IEMF-4v5_KLr_86kTQ1odWCgTbWvG0vo';

const headers = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json'
};

// Types
export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: number;
  userid: number;
  content: string;
}

export interface Comment {
  id: number;
  postid: number;
  content: string;
}

export interface UsersResponse {
  users: {
    [key: string]: string;
  };
}

export interface PostsResponse {
  posts: Post[];
}

export interface CommentsResponse {
  comments: Comment[];
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching users');
    const response = await fetch(`${BASE_URL}/users`, { 
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: UsersResponse = await response.json();
    console.log('Users data received:', data);
    
    return Object.entries(data.users).map(([id, name]) => ({
      id,
      name,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get posts by user ID
export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  try {
    console.log(`Fetching posts for user ${userId}`);
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`, { 
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: PostsResponse = await response.json();
    console.log(`Received ${data.posts?.length || 0} posts for user ${userId}`);
    
    return data.posts || [];
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
};

// Get all posts from all users (helper function to get all posts)
export const getAllPosts = async (userIds: string[]): Promise<Post[]> => {
  try {
    console.log(`Fetching posts for ${userIds.length} users`);
    const postsPromises = userIds.map(userId => getPostsByUserId(userId));
    const postsArrays = await Promise.all(postsPromises);
    const allPosts = postsArrays.flat();
    console.log(`Total posts fetched: ${allPosts.length}`);
    return allPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

// Get comments by post ID
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  try {
    console.log(`Fetching comments for post ${postId}`);
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, { 
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: CommentsResponse = await response.json();
    console.log(`Received ${data.comments?.length || 0} comments for post ${postId}`);
    
    return data.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
}; 
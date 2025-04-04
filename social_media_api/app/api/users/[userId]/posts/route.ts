import { NextRequest, NextResponse } from 'next/server';

// Get auth token from environment variables
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    console.log(`API route: Fetching posts for user ${userId}`);
    
    const response = await fetch(`http://20.244.56.144/evaluation-service/users/${userId}/posts`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.error('API route: Error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('API route: Error details:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch posts: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`API route: Received ${data.posts?.length || 0} posts for user ${userId}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route: Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
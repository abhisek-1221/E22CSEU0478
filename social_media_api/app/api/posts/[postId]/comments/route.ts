import { NextRequest, NextResponse } from 'next/server';

// Get auth token from environment variables
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    console.log(`API route: Fetching comments for post ${postId}`);
    
    const response = await fetch(`http://20.244.56.144/evaluation-service/posts/${postId}/comments`, {
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
        { error: `Failed to fetch comments: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`API route: Received ${data.comments?.length || 0} comments for post ${postId}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route: Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
} 
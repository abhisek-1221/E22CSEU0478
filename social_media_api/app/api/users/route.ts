import { NextResponse } from 'next/server';

const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

export async function GET() {
  try {
    console.log('API route: Fetching users');
    
    const response = await fetch('http://20.244.56.144/evaluation-service/users', {
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
        { error: `Failed to fetch users: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API route: Users data received');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route: Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getWindowState, updateWindow, calculateAverage } from '@/app/utils/numberStore';

type NumberType = 'p' | 'f' | 'e' | 'r';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';
const API_ENDPOINTS: Record<NumberType, string> = {
  p: `${API_BASE_URL}/prime`,
  f: `${API_BASE_URL}/fibo`,
  e: `${API_BASE_URL}/even`,
  r: `${API_BASE_URL}/rand`,
};

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNzQ4MjYzLCJpYXQiOjE3NDM3NDc5NjMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY0OTcxYTYzLTUyNWEtNGYyNy05OTk4LTAxY2Q5YzAwOWY4NCIsInN1YiI6ImUyMmNzZXUwNDc4QGJlbm5ldHQuZWR1LmluIn0sImVtYWlsIjoiZTIyY3NldTA0NzhAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoiYWJoaXNlayBzYWhvbyIsInJvbGxObyI6ImUyMmNzZXUwNDc4IiwiYWNjZXNzQ29kZSI6InJ0Q0haSiIsImNsaWVudElEIjoiZjQ5NzFhNjMtNTI1YS00ZjI3LTk5OTgtMDFjZDljMDA5Zjg0IiwiY2xpZW50U2VjcmV0IjoiVWVoWGFhbVJ4VUZlWW5SZiJ9.H4fruhPaql-fow11QJQK5V20X61SPyhUZeLva8XSv_I";

// Timeout for the API call (500ms)
const API_TIMEOUT = 500;

// Helper function to fetch numbers with timeout
async function fetchNumbersWithTimeout(type: NumberType): Promise<number[]> {
  // Here I Created an abort controller for the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const url = API_ENDPOINTS[type];
    if (!url) {
      throw new Error(`Invalid number type: ${type}`);
    }

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.numbers) ? data.numbers : [];
  } catch (error) {
    // Handled timeout or other errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Error fetching numbers:', error);
    }
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { numberid: string } }
) {
  try {
    // Get the number type from the URL parameter
    const numberType = params.numberid;

    // Validate the number type
    if (!['p', 'f', 'e', 'r'].includes(numberType)) {
      return NextResponse.json(
        { error: `Invalid number type: ${numberType}. Must be one of: p, f, e, r` },
        { status: 400 }
      );
    }

    // Get the previous state before fetching new numbers
    const windowPrevState = getWindowState(numberType);

    // Set a timeout for the overall request processing
    const requestStartTime = Date.now();
    
    // Fetch numbers from the third-party service
    const fetchedNumbers = await fetchNumbersWithTimeout(numberType as NumberType);
    
    // Check if we're approaching the timeout limit
    if (Date.now() - requestStartTime > 450) {
      // If getting close to timeout, return early with current state
      return NextResponse.json({
        windowPrevState,
        windowCurrState: windowPrevState,
        numbers: [],
        avg: calculateAverage(windowPrevState),
        warning: 'Request taking too long, returning current state'
      });
    }

    // Update the window state with new numbers
    const { currState } = updateWindow(numberType, fetchedNumbers);

    // Calculated the average
    const avg = calculateAverage(currState);

    return NextResponse.json({
      windowPrevState,
      windowCurrState: currState,
      numbers: fetchedNumbers,
      avg,
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
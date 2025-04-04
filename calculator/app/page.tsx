'use client';

import { useState, useEffect } from 'react';

interface CalcResponse {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

export default function Home() {
  const [numberType, setNumberType] = useState<string>('f');
  const [response, setResponse] = useState<CalcResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/numbers/${numberType}`);
      if (!res.ok) {
        throw new Error('Failed to fetch numbers');
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Average Calculator Microservice</h1>
      
      <div className="mb-6">
        <label className="block mb-2">Select Number Type:</label>
        <select 
          value={numberType}
          onChange={(e) => setNumberType(e.target.value)}
          className="p-2 border rounded mb-4 w-full max-w-md"
        >
          <option value="f">Fibonacci (f)</option>
          <option value="e">Even (e)</option>
          <option value="p">Prime (p)</option>
          <option value="r">Random (r)</option>
        </select>
        
        <button 
          onClick={fetchNumbers}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Fetch Numbers'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="text-xl font-semibold mb-3">Result</h2>
          
          <div className="mb-3">
            <h3 className="font-medium">Previous Window State:</h3>
            <div className="bg-white p-2 rounded border">
              {response.windowPrevState.length > 0 
                ? response.windowPrevState.join(', ') 
                : 'Empty'}
            </div>
          </div>
          
          <div className="mb-3">
            <h3 className="font-medium">Current Window State:</h3>
            <div className="bg-white p-2 rounded border">
              {response.windowCurrState.length > 0 
                ? response.windowCurrState.join(', ') 
                : 'Empty'}
            </div>
          </div>
          
          <div className="mb-3">
            <h3 className="font-medium">Fetched Numbers:</h3>
            <div className="bg-white p-2 rounded border">
              {response.numbers.length > 0 
                ? response.numbers.join(', ') 
                : 'No numbers fetched'}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium">Average:</h3>
            <div className="bg-white p-2 rounded border font-semibold">
              {response.avg.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

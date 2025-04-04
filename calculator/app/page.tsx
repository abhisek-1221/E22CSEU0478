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
      console.log(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Average Calculator Microservice</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Number Type:</label>
        <select 
          value={numberType}
          onChange={(e) => setNumberType(e.target.value)}
          className="p-2 border border-gray-400 rounded mb-4 w-full max-w-md bg-white text-gray-800"
        >
          <option value="f">Fibonacci (f)</option>
          <option value="e">Even (e)</option>
          <option value="p">Prime (p)</option>
          <option value="r">Random (r)</option>
        </select>
        
        <button 
          onClick={fetchNumbers}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium"
        >
          {loading ? 'Loading...' : 'Fetch Numbers'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-200 text-red-800 rounded border border-red-300 font-medium">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Result</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-1">Previous Window State:</h3>
            <div className="bg-white p-3 rounded border border-gray-300 text-gray-800">
              {response.windowPrevState.length > 0 
                ? response.windowPrevState.join(', ') 
                : 'Empty'}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-1">Current Window State:</h3>
            <div className="bg-white p-3 rounded border border-gray-300 text-gray-800">
              {response.windowCurrState.length > 0 
                ? response.windowCurrState.join(', ') 
                : 'Empty'}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-1">Fetched Numbers:</h3>
            <div className="bg-white p-3 rounded border border-gray-300 text-gray-800">
              {response.numbers.length > 0 
                ? response.numbers.join(', ') 
                : 'No numbers fetched'}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Average:</h3>
            <div className="bg-white p-3 rounded border border-gray-300 text-blue-700 font-bold text-lg">
              {response.avg.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

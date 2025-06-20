import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compiler states
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/problems/${id}`);
        setProblem(res.data.problem);
      } catch (err) {
        setProblem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setOutput('');
    const payload = {
      language: 'cpp',
      code,
      input,
    };
    try {
      const backendUrl = `http://localhost:8000/problems/run`;
      const { data } = await axios.post(backendUrl, payload);
      setOutput(data.output);
    } catch (error) {
      if (error.response) {
        setOutput(`Error: ${error.response.data.error || 'Server error occurred'}`);
      } else if (error.request) {
        setOutput('Error: Could not connect to server.');
      } else {
        setOutput(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!problem) return <div className="text-white p-8">Problem not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row p-4 md:p-8 gap-8">
      {/* Left: Problem Details */}
      <div className="md:w-1/2 bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold">{problem.title}</h2>
        <div>
          <span className={
            problem.difficulty === 'Easy'
              ? 'text-green-400'
              : problem.difficulty === 'Medium'
              ? 'text-yellow-400'
              : 'text-red-400'
          }>
            {problem.difficulty}
          </span>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p className="whitespace-pre-line">{problem.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Constraints</h3>
          <ul className="list-disc ml-6">
            {problem.constraints && problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Input Format</h3>
          <p>{problem.input_format}</p>
        </div>
        <div>
          <h3 className="font-semibold">Output Format</h3>
          <p>{problem.output_format}</p>
        </div>
        <div>
          <h3 className="font-semibold">Example Cases</h3>
          {problem.example_cases && problem.example_cases.map((ex, i) => (
            <div key={i} className="mb-2">
              <div><span className="font-semibold">Input:</span> <pre className="inline">{ex.input}</pre></div>
              <div><span className="font-semibold">Output:</span> <pre className="inline">{ex.output}</pre></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Compiler */}
      <div className="md:w-1/2 space-y-4">
        <div
          className="rounded-lg shadow-sm border border-gray-700 overflow-hidden bg-gray-900"
          style={{ height: '400px', overflowY: 'auto' }}
        >
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, languages.cpp || languages.clike)}
            padding={12}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              height: '100%',
              overflowY: 'auto',
              outline: 'none',
              backgroundColor: '#18181b',
              color: '#fff'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Program Input
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-700 rounded-md text-sm resize-none bg-gray-800 text-white"
            placeholder="Enter input (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Output
          </label>
          <div className="p-3 h-28 bg-gray-800 border border-gray-700 rounded-md overflow-y-auto font-mono text-sm">
            {output ? output : 'Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;
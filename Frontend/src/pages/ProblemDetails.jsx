import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const codeTemplates = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
    }
}`,
  python: `# Write your solution here

`
};

function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compiler states
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(codeTemplates['cpp']);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [aiReview, setAiReview] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50); // percent
  const isResizing = useRef(false);

  // Resizing logic
  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const totalWidth = window.innerWidth;
      let newLeftWidth = (e.clientX / totalWidth) * 100;
      newLeftWidth = Math.max(20, Math.min(80, newLeftWidth));
      setLeftWidth(newLeftWidth);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        if (!id) {
          setError('No problem ID provided');
          setLoading(false);
          return;
        }
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendUrl}/problems/${id}`);
        setProblem(res.data.problem || res.data);
        setError(null);
      } catch (err) {
        if (err.response) {
          setError(`Server Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.request) {
          setError('Network Error: Could not connect to server');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(codeTemplates[lang]);
  };

  // Run code handler
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const payload = {
        language,
        code,
        input,
      };
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backendUrl}/problems/run`, payload);
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
      setIsRunning(false);
    }
  };

  // AI Review handler
  const handleAiReview = async () => {
    setIsReviewing(true);
    setAiReview('');
    try {
      const payload = { code };
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backendUrl}/ai-review`, payload);
      setAiReview(data.review);
    } catch (error) {
      setAiReview('Error in AI review, error: ' + error.message);
    } finally {
      setIsReviewing(false);
    }
  };

  // Submit solution handler
  const handleSubmit = async () => {
    try {
      setOutput('');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const payload = {
        language,
        code,
      };
      const { data } = await axios.post(`${backendUrl}/problems/${id}/submit`, payload);
      setOutput(
        data.results
          .map(
            (res, idx) =>
              `Test Case ${idx + 1}: ${res.passed ? '✅ Passed' : '❌ Failed'}\nInput: ${res.input}\nExpected: ${res.expected}\nYour Output: ${res.output}\n`
          )
          .join('\n')
      );
    } catch (error) {
      setOutput('Submission error: ' + (error.response?.data?.error || error.message));
    }
  };

  // Go back handler
  const handleGoBack = () => {
    navigate('/problem');
  };

  // Choose Prism language for highlighting
  const getPrismLang = () => {
    if (language === 'cpp') return languages.clike;
    if (language === 'java') return languages.clike;
    if (language === 'python') return languages.python;
    return languages.clike;
  };

  // Helper to ensure string for ReactMarkdown
  const toMarkdownString = (val) =>
    Array.isArray(val) ? val.join('\n') : String(val ?? '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading problem...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">{error}</div>
          <div className="text-sm text-gray-400 mb-4">Problem ID: {id || 'Not provided'}</div>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go Back to Problems
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">Problem not found</div>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with back button */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <button 
          onClick={handleGoBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mb-2"
        >
          ← Back to Problems
        </button>
      </div>

      <div className="flex h-screen select-none" style={{ userSelect: isResizing.current ? 'none' : 'auto' }}>
        {/* Problem Panel */}
        <div
          className="bg-gray-800 p-6 overflow-y-auto"
          style={{
            width: `${leftWidth}%`,
            minWidth: '200px',
            maxWidth: '80vw',
            transition: isResizing.current ? 'none' : 'width 0.2s'
          }}
        >
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{problem?.title}</h1>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                problem?.difficulty === 'Easy'
                  ? 'bg-green-900 text-green-300'
                  : problem?.difficulty === 'Medium'
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {problem?.difficulty}
            </span>
          </div>

          {/* Problem Description */}
          <div className="prose prose-invert max-w-none">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">Description</h3>
              <div className="text-gray-300 leading-relaxed">
                {problem?.description ? (
                  <ReactMarkdown>{toMarkdownString(problem.description)}</ReactMarkdown>
                ) : (
                  <p>No description available.</p>
                )}
              </div>
            </div>

            {/* Examples */}
            {problem?.example_cases && problem.example_cases.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Examples</h3>
                {problem.example_cases.map((example, index) => (
                  <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                    <div className="mb-2">
                      <strong className="text-white">Example {index + 1}:</strong>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Input: </span>
                      <code className="text-green-300">{example.input}</code>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Output: </span>
                      <code className="text-green-300">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-gray-400">Explanation: </span>
                        <span className="text-gray-300">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Input Format */}
            {problem?.input_format && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Input Format</h3>
                <div className="text-gray-300">
                  <ReactMarkdown>{toMarkdownString(problem.input_format)}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Output Format */}
            {problem?.output_format && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Output Format</h3>
                <div className="text-gray-300">
                  <ReactMarkdown>{toMarkdownString(problem.output_format)}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem?.constraints && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Constraints</h3>
                <div className="text-gray-300">
                  <ReactMarkdown>{toMarkdownString(problem.constraints)}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Draggable Divider */}
        <div
          style={{
            width: '6px',
            cursor: 'col-resize',
            background: '#222',
            zIndex: 10,
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
        />

        {/* Code Editor Panel */}
        <div
          className="bg-gray-800 p-6 overflow-y-auto"
          style={{
            width: `${100 - leftWidth}%`,
            minWidth: '200px',
            maxWidth: '80vw',
            transition: isResizing.current ? 'none' : 'width 0.2s'
          }}
        >
          {/* CodeX Editor Header Bar */}
          <div className="flex justify-between items-center mb-4 bg-gray-900 rounded-t-lg px-6 py-3">
            <h2 className="text-2xl font-bold text-white select-none">
              Code<span className="text-gray-400">X</span> Editor
            </h2>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="p-2 rounded border border-gray-700 bg-gray-800 text-white"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          {/* Code Editor */}
          <div className="bg-gray-900 shadow-lg rounded-lg p-4 mb-4">
            <div
              className="bg-gray-700 rounded-lg overflow-auto"
              style={{
                height: '300px',
                overflowY: 'auto',
                overflowX: 'auto'
              }}
            >
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={code => highlight(code, getPrismLang())}
                padding={15}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 14,
                  minHeight: '300px',
                  color: '#fff',
                  background: '#374151'
                }}
              />
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-gray-900 shadow-lg rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Input</h3>
            <textarea
              rows="3"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter test input..."
              className="w-full p-3 text-sm border border-gray-700 rounded-md resize-none text-white bg-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Output Section */}
          <div className="bg-gray-900 shadow-lg rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Output</h3>
            <div 
              className="bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-wrap text-white overflow-y-auto"
              style={{ minHeight: '80px', maxHeight: '120px' }}
            >
              {output ? output : <span className="text-gray-400">Output will appear here...</span>}
            </div>
          </div>

          {/* AI Review Section */}
          <div className="bg-gray-900 shadow-lg rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">AI Review</h3>
            <div 
              className="prose prose-sm text-white overflow-y-auto bg-gray-700 p-3 rounded"
              style={{ minHeight: '80px', maxHeight: '120px' }}
            >
              {aiReview === '' ? (
                <div className="text-gray-400">🤖 Click "AI Review" to get code feedback</div>
              ) : (
                <ReactMarkdown>{toMarkdownString(aiReview)}</ReactMarkdown>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleAiReview}
              disabled={isReviewing}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isReviewing ? 'Reviewing...' : 'AI Review'}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;
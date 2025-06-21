import React, { useState } from 'react';
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
    int num1, num2, sum;
    cin >> num1 >> num2;
    sum = num1 + num2;
    cout << "The sum of the two numbers is: " << sum;
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num1 = sc.nextInt();
        int num2 = sc.nextInt();
        int sum = num1 + num2;
        System.out.println("The sum of the two numbers is: " + sum);
    }
}`,
  python: `# Sample Python program to add two numbers
num1 = int(input())
num2 = int(input())
sum = num1 + num2
print("The sum of the two numbers is:", sum)
`
};

function Home() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(codeTemplates['cpp']);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [aiReview, setAiReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Handle language change
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(codeTemplates[lang]);
  };

  // Run code handler
  const handleRun = async () => {
    setIsLoading(true);
    setOutput('');
    try {
      const payload = {
        language,
        code,
        input,
      };
      const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/problems/run`;
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

  // AI Review handler
  const handleAiReview = async () => {
    setIsReviewing(true);
    setAiReview('');
    try {
      const payload = { code };
      const { data } = await axios.post('http://localhost:8000/ai-review', payload);
      setAiReview(data.review);
    } catch (error) {
      setAiReview('Error in AI review, error: ' + error.message);
    } finally {
      setIsReviewing(false);
    }
  };

  // Choose Prism language for highlighting
  const getPrismLang = () => {
    if (language === 'cpp') return languages.clike;
    if (language === 'java') return languages.clike;
    if (language === 'python') return languages.python;
    return languages.clike;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">AlgoU Online Code Compiler</h1>
      <div className="flex justify-end mb-4">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 rounded border border-gray-300"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Code Editor</h2>
          <div className="bg-gray-100 rounded-lg overflow-y-auto flex-grow" style={{ height: '500px' }}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, getPrismLang())}
              padding={15}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: '500px'
              }}
            />
          </div>
        </div>

        {/* Input, Output, AI Review */}
        <div className="flex flex-col gap-4">
          {/* Input Box */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Input</h2>
            <textarea
              rows="4"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter input values..."
              className="w-full p-3 text-sm border border-gray-300 rounded-md resize-none"
            />
          </div>

          {/* Output Box */}
          <div className="bg-white shadow-lg rounded-lg p-4 overflow-y-auto" style={{ height: '150px' }}>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Output</h2>
            <div className="text-sm font-mono whitespace-pre-wrap text-gray-800">{output}</div>
          </div>

          {/* AI Review Box */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">AI Review</h2>
            <div className="prose prose-sm text-gray-800 overflow-y-auto" style={{ height: '150px' }}>
              {
                aiReview === ''
                  ? <div>🤖</div>
                  : <ReactMarkdown>{aiReview}</ReactMarkdown>
              }
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleRun}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isLoading ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleAiReview}
              disabled={isReviewing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isReviewing ? 'Reviewing...' : 'AI Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
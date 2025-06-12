import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [code, setCode] = useState(`
  // Include the input/output stream library
  #include <iostream> 

  // Define the main function
  int main() { 
      // Output "Hello World!" to the console
      std::cout << "Hello World!"; 
      
      // Return 0 to indicate successful execution
      return 0; 
  }`);
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
    
    // Add Tailwind CSS CDN if not already present
    const existingTailwind = document.querySelector('link[href*="tailwind"]');
    if (!existingTailwind) {
      const link = document.createElement('link');
      link.href = 'https://cdn.tailwindcss.com';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    
    // Set default code based on selected language
    switch(language) {
      case 'cpp':
        setCode(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`);
        break;
      case 'c':
        setCode(`#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`);
        break;
      case 'py':
        setCode(`print("Hello World!")`);
        break;
      case 'java':
        setCode(`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`);
        break;
      default:
        setCode('');
    }
    setOutput(''); // Clear previous output
  };

  const handleSubmit = async () => {
    const payload = {
      language: selectedLanguage,
      code
    };

    try {
      const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL, payload);
      console.log(data);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
      setOutput('Error: ' + (error.response?.data?.message || 'Failed to execute code'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome {loggedInUser}</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Code Compiler Section */}
      <div className="container mx-auto py-8 flex flex-col items-center px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">AlgoU Online Code Compiler</h2>
        
        {/* Language Selector */}
        <select 
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="select-box border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:border-indigo-500 bg-white"
        >
          <option value='cpp'>C++</option>
          <option value='c'>C</option>
          <option value='py'>Python</option>
          <option value='java'>Java</option>
        </select>

        {/* Code Editor */}
        <div className="bg-gray-100 shadow-md w-full max-w-4xl mb-4 rounded-lg border" style={{ height: '400px', overflowY: 'auto' }}>
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={15}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              outline: 'none',
              border: 'none',
              backgroundColor: '#f7fafc',
              height: '100%',
              overflowY: 'auto',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Run Button */}
        <button 
          onClick={handleSubmit} 
          type="button" 
          className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-6 py-3 mb-4 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 me-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>
          Run Code
        </button>

        {/* Output Section */}
        {output && (
          <div className="outputbox bg-gray-800 text-green-400 rounded-lg shadow-md p-6 w-full max-w-4xl">
            <h3 className="text-lg font-semibold mb-3 text-white">Output:</h3>
            <pre style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>{output}</pre>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
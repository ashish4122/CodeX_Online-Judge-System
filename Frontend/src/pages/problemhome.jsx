import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProblemsHome() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendUrl}/problems`);
        setProblems(res.data.problems || []);
      } catch (err) {
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Filter problems by selected difficulty
  const filteredProblems =
    difficulty === 'All'
      ? problems
      : problems.filter((problem) => problem.difficulty === difficulty);

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIdx = (currentPage - 1) * problemsPerPage;
  const currentProblems = filteredProblems.slice(startIdx, startIdx + problemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* CodeX Symbol at the top left, as part of the flow */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white select-none">
          Code<span className="text-gray-400">X</span>
        </h1>
      </div>
      {/* Row: Problems centered, Filter right */}
      <div className="mb-6 flex items-center justify-between">
        {/* Left spacer, same width as filter */}
        <div style={{ width: '180px' }}></div>
        {/* Problems centered */}
        <h1 className="text-3xl font-bold text-center flex-1">
          Problems
        </h1>
        {/* Filter right, fixed width */}
        <div style={{ width: '180px' }} className="flex justify-end">
          <label htmlFor="difficulty" className="mr-2">
            Filter by:
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="text-gray-900 px-2 py-1 rounded"
          >
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {currentProblems.map((problem) => (
                <tr
                  key={problem._id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">
                    <Link
                      to={`/problems/${problem._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        problem.difficulty === 'Easy'
                          ? 'text-green-400'
                          : problem.difficulty === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProblemsHome;
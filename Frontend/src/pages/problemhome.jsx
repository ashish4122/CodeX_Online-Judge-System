import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProblemsHome() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:8000/problems');
        setProblems(res.data.problems || []);
      } catch (err) {
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} className="border-t border-gray-700 hover:bg-gray-700 transition">
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
      )}
    </div>
  );
}
export default ProblemsHome;
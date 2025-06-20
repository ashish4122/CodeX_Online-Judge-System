import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircleCheck, Pencil, Trash2 } from 'lucide-react';

export default function ProblemDashboard() {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", difficulty: "Easy" });
  const [editingId, setEditingId] = useState(null);

  const fetchProblems = async () => {
    try {
      const res = await axios.get("/api/problems");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setProblems(data);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`/api/problems/${editingId}`, form);
      else await axios.post("/api/problems", form);
      setForm({ title: "", description: "", difficulty: "Easy" });
      setEditingId(null);
      fetchProblems();
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/problems/${id}`);
      fetchProblems();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleEdit = (problem) => {
    setForm(problem);
    setEditingId(problem._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-20">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-700">Problem Dashboard</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-10">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="border p-2 rounded w-full"
          />
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editingId ? "Update Problem" : "Add Problem"}
          </button>
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="border p-2 mt-4 rounded w-full"
        />
      </form>

      {/* Table Header */}
      <div className="bg-white rounded-t-lg shadow px-6 py-3 font-semibold grid grid-cols-12 text-gray-600">
        <div className="col-span-1">#</div>
        <div className="col-span-6">Title</div>
        <div className="col-span-2">Difficulty</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {/* Problem List */}
      <div className="bg-white rounded-b-lg shadow divide-y">
        {problems.map((problem, index) => (
          <div key={problem._id} className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50">
            <div className="col-span-1 text-green-500"><CircleCheck size={18} /></div>
            <div className="col-span-6 font-medium text-gray-800">{problem.title}</div>
            <div className="col-span-2">
              <span className={`text-sm px-2 py-1 rounded-full font-semibold ${
                problem.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : problem.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="col-span-3 text-right space-x-2">
              <button
                onClick={() => handleEdit(problem)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(problem._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {problems.length === 0 && (
          <div className="text-center py-10 text-gray-500">No problems available.</div>
        )}
      </div>
    </div>
  );
}

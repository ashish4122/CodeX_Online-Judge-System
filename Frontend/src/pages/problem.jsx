import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", difficulty: "Easy" });
  const [editingId, setEditingId] = useState(null);

  const fetchProblems = async () => {
    const res = await axios.get("/api/problems");
    setProblems(res.data);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/problems/${editingId}`, form);
    } else {
      await axios.post("/api/problems", form);
    }
    setForm({ title: "", description: "", difficulty: "Easy" });
    setEditingId(null);
    fetchProblems();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/problems/${id}`);
    fetchProblems();
  };

  const handleEdit = (problem) => {
    setForm(problem);
    setEditingId(problem._id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Problem Dashboard</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br />
        <select name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select><br />
        <button type="submit">{editingId ? "Update" : "Add"} Problem</button>
      </form>

      <ul>
        {problems.map((problem) => (
          <li key={problem._id}>
            <strong>{problem.title}</strong> [{problem.difficulty}]
            <p>{problem.description}</p>
            <button onClick={() => handleEdit(problem)}>Edit</button>
            <button onClick={() => handleDelete(problem._id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import "./App.css";
import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask} from "./api";


export default function App(){
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const selected = tasks.find((t) => t.id === selectedId);

  useEffect(() => {
    getTasks()
    .then((data) => setTasks(data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
  }, [])
  

  async function handleAdd(event) {
    event.preventDefault();
    if(!title.trim()) return;

    try {
      const newTask = await createTask(title.trim());
      setTasks((current) => [newTask, ...current]);
      setTitle("");
      setError("");
    } catch(err) {
      setError(err.message);
    }
  }


  async function handleToggle(tasks) {
    try {
      const saved = await updateTask(tasks.id, {done: !tasks.done});
      setTasks((current) => current.map((t) => (t.id === saved.id ? saved : t)));
      setError(""); 
    } catch(err) {
      setError(err.message);
    }
  }


  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((t) => t.id !== id));
      setError("");
    } catch(err) {
      setError(err.message)
    }
  }


  return (
    <main>
      <h1>Task Board</h1>

      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New task"
          maxLength={200}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p role="alert">{error}</p>}
      {loading && <p>Loading...</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(task)}
              />
            </label>
            <button onClick={() => setSelectedId(task.id)}>{task.title}</button>
          </li>
        ))}
      </ul>
      {selected && (
        <section>
          <h2>{selected.title}</h2>
          <p>Status: {selected.done ? "Done" : "Not done"}</p>
          <p>Created: {new Date(selected.created_at).toLocaleString()}</p>
          <button onClick={() => setSelectedId(null)}>Close</button>
          <button onClick={() => handleDelete(selected.id)}>Delete</button>
        </section>
      )}
    </main>
  );

}
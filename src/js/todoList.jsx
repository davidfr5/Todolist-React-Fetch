import React, { useState, useEffect } from "react";
import "../styles/index.css";

const API_BASE = "https://playground.4geeks.com/todo";

function TodoList() {
  const [username, setUsername] = useState("");
  const [userSet, setUserSet] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Creamos usuario si no existe
  const createUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${username}`, {
        method: "POST",
      });
      if (res.ok || res.status === 409) {
        setUserSet(true);
        loadTasks();
      } else {
        alert("Error creando usuario");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cargar tareas del usuario
  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.todos || []);
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  // Agregar nueva tarea
  const addTask = async (e) => {
    if (e.key === "Enter" && newTask.trim()) {
      try {
        const res = await fetch(`${API_BASE}/todos/${username}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: newTask.trim(), is_done: false }),
        });
        if (res.ok) {
          setNewTask("");
          loadTasks();
        }
      } catch (error) {
        console.error("Error agregando tarea:", error);
      }
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadTasks();
      }
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">TodoList</h1>

      {!userSet ? (
        <div className="todo-box">
          <input
            className="todo-input"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createUser()}
          />
        </div>
      ) : (
        <div className="todo-box">
          <input
            className="todo-input"
            placeholder="Añade una tarea"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={addTask}
          />
          <ul className="todo-list">
            {tasks.length === 0 ? (
              <li className="todo-empty">No hay tareas, añade una</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="todo-item">
                  <span>{task.label}</span>
                  <button
                    className="todo-remove"
                    onClick={() => deleteTask(task.id)}
                  >
                    ✖
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TodoList;

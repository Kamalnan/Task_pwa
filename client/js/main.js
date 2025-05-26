document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const emptyMessage = document.getElementById("empty-message");
  
    // Fetch all tasks from backend
    const fetchTasks = async () => {
      taskList.innerHTML = "";
      try {
        const res = await fetch("http://localhost:5000/api/tasks");
        const tasks = await res.json();
  
        if (tasks.length === 0) {
          emptyMessage.style.display = "block";
        } else {
          emptyMessage.style.display = "none";
          tasks.forEach(addTaskToDOM);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
  
    // Add task to DOM
    const addTaskToDOM = (task) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${task.title}</strong> - ${task.description}
        (Due: ${new Date(task.dueDate).toLocaleDateString()})
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task._id}" />
      `;
      li.querySelector("input").addEventListener("change", handleCheckboxChange);
      taskList.appendChild(li);
    };
  
    // Submit new task
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const dueDate = document.getElementById("dueDate").value;
  
      if (!title || !description || !dueDate) return;
  
      try {
        const res = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, dueDate, completed: false })
        });
  
        const newTask = await res.json();
        addTaskToDOM(newTask);
        emptyMessage.style.display = "none";
        taskForm.reset();
      } catch (err) {
        console.error("Error adding task:", err);
      }
    });
  
    // Handle checkbox toggle for task completion
    const handleCheckboxChange = async (e) => {
      const id = e.target.dataset.id;
      const completed = e.target.checked;
  
      try {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed })
        });
      } catch (err) {
        console.error("Error updating task:", err);
      }
    };
  
    fetchTasks();
  });
  
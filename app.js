const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const counter = document.getElementById("counter");
const empty = document.getElementById("empty");
const clearBtn = document.getElementById("clear");
const footer = document.getElementById("footer");
const date = document.getElementById("date");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function showDate() {
  const today = new Date();
  date.textContent = today.toDateString();
}

showDate();

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateCounter() {
  const remaining = todos.filter(todo => !todo.completed).length;
  counter.textContent = `${remaining} tasks remaining`;

  empty.style.display = todos.length ? "none" : "block";
  footer.classList.toggle("hidden", !todos.length);
}

function renderTodos(filter = "all") {
  list.innerHTML = "";

  let filteredTodos = todos;

  if (filter === "active") {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  if (filter === "completed") {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");

    if (todo.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span>${todo.text}</span>
      </div>
      <button class="delete-btn">Delete</button>
    `;

    const checkbox = li.querySelector("input");

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos(document.querySelector(".filter-btn.active").dataset.filter);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos(document.querySelector(".filter-btn.active").dataset.filter);
    });

    list.appendChild(li);
  });

  updateCounter();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  todos.push({
    text,
    completed: false
  });

  input.value = "";

  saveTodos();
  renderTodos(document.querySelector(".filter-btn.active").dataset.filter);
});

clearBtn.addEventListener("click", () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos(document.querySelector(".filter-btn.active").dataset.filter);
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");

    renderTodos(btn.dataset.filter);
  });
});

renderTodos();
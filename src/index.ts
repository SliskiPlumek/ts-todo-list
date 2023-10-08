const todoInput = document.querySelector("input") as HTMLInputElement;
const todoList = document.querySelector("#todoList") as HTMLElement;

type Todo = {
  title: string;
  done: boolean;
  id: number;
};

// Load todos from localStorage or initialize an empty array
const savedTodos = localStorage.getItem("todos");
const todos: Todo[] = savedTodos ? JSON.parse(savedTodos) : [];

function saveTodos() {
  // Save todos to localStorage as a JSON string
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createTodoElement(todo: Todo) {
  const todoElement = document.createElement("div");
  todoElement.textContent = todo.title;
  todoElement.classList.add("todo-item");
  todoElement.id = todo.id.toString();
  if (todo.done) {
    todoElement.style.textDecoration = "line-through";
  }

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("todo-buttons", "delete");
  deleteButton.innerHTML = "🗑️";

  const doneButton = document.createElement("button");
  doneButton.classList.add("todo-buttons", "done");
  doneButton.innerHTML = "✔️";

  const editButton = document.createElement("button");
  editButton.classList.add("todo-buttons", "edit");
  editButton.innerHTML = "✏️";

  doneButton.addEventListener("click", () => {
    todo.done = true;
    todoElement.style.textDecoration = "line-through";
    todoElement.removeChild(doneButton);
    todoElement.removeChild(editButton);
    todoElement.removeChild(deleteButton);
    saveTodos(); // Save todos after marking one as done
  });

  editButton.addEventListener("click", () => {
    const newTitle = prompt("Edit your task: ") as string;
    if (newTitle === null) {
      console.log("Editing todo failed");
      return;
    }

    todo.title = newTitle;
    todoElement.textContent = newTitle;
    todoElement.appendChild(doneButton);
    todoElement.appendChild(editButton);
    todoElement.appendChild(deleteButton);
    saveTodos(); // Save todos after editing
  });

  deleteButton.addEventListener("click", () => {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
      todoList.removeChild(todoElement);
      saveTodos(); // Save todos after deleting
    }
  });

  if (todo.done === false) {
    todoElement.appendChild(doneButton);
    todoElement.appendChild(editButton);
    todoElement.appendChild(deleteButton);
  }

  todoList.appendChild(todoElement);
}

function showTodos() {
  todos.forEach((todo) => {
    if (!document.getElementById(todo.id.toString())) {
      createTodoElement(todo);
    }
  });
}

function addTodo() {
  let inputValue = todoInput.value;
  if (inputValue === "") {
    return;
  }
  let id: number;

  do {
    let min = 1;
    let max = 1000;
    id = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (todos.some((todo) => todo.id === id)); // Check if ID is already taken in todos

  const newTodo: Todo = { title: inputValue, done: false, id: id };
  todos.push(newTodo);
  saveTodos(); // Save todos after adding a new one

  todoInput.value = "";
}

todoInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTodo();
    showTodos();
  }
});

showTodos();

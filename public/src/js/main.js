const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("form");
  submit.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

function generateId() {
  return +new Date();
}

function generateTodo(id, title, date, isCompleted) {
  return { id, title, date, isCompleted };
}

function addTodo() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;

  const generateID = generateId();
  const todo = generateTodo(generateID, title, date, false);
  todos.push(todo);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function createTodo(todo) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todo.title;

  const textDate = document.createElement("p");
  textDate.innerText = todo.date;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textDate);

  const todoContainer = document.createElement("div");
  todoContainer.classList.add("item", "shadow");
  todoContainer.append(textContainer);
  todoContainer.setAttribute("id", `todo-${todo.id}`);

  if (todo.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTodoFromCompleted(todo.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("trash-button");

    deleteButton.addEventListener("click", function () {
      removeTodoFromCompleted(todo.id);
    });

    todoContainer.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTodoToCompleted(todo.id);
    });

    todoContainer.append(checkButton);
  }

  return todoContainer;
}

function removeTodoFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget == -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTodoFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTodoToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id == todoId) {
      return index;
    }
  }

  return -1;
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id == todoId) {
      return todoItem;
    }
  }

  return null;
}

// * TESTS TODO ADDED TO ARRAY
document.addEventListener(RENDER_EVENT, function () {
  console.log(todos);
  const uncompletedTodo = document.getElementById("todos");
  uncompletedTodo.innerHTML = "";

  const completedTodo = document.getElementById("completed-todos");
  completedTodo.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = createTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTodo.append(todoElement);
    } else {
      completedTodo.append(todoElement);
    }
  }
});

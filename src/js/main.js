const todos = [];
const RENDER_EVENT = "render-todo";
const STORAGE_KEY = "storage-key";
const SAVED_EVENT = "saved-todo";

function generateId() {
  return +new Date();
}

function generateTodo(id, title, date, isCompleted) {
  return { id, title, date, isCompleted };
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }

  return null;
}

function saveData() {
  if(isStorageExist) {
    const parsed = JSON.stringify(todos)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY)

  let data = JSON.parse(serializedData)

  if(data !== null) {
    for(const todo of data) {
      todos.push(todo)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function isStorageExist() {
  if(typeof(Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage')
    return false
  }
  return true
}

function createTodo(todo) {
  const { id, title, date, isCompleted } = todo

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textDate = document.createElement("p");
  textDate.innerText = date;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textDate);

  const todoContainer = document.createElement("div");
  todoContainer.classList.add("item", "shadow");
  todoContainer.append(textContainer);
  todoContainer.setAttribute("id", `todo-${id}`);

  if (todo.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTodoFromCompleted(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("trash-button");

    deleteButton.addEventListener("click", function () {
      removeTodoFromCompleted(id);
    });

    todoContainer.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTodoToCompleted(id);
    });

    todoContainer.append(checkButton);
  }

  return todoContainer;
}

function addTodo() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;

  const generateID = generateId();
  const todo = generateTodo(generateID, title, date, false);
  todos.push(todo);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function addTodoToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function removeTodoFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget == -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function undoTodoFromCompleted(todoId) {

  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}


document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("form");

  submit.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  if(isStorageExist()) {
    loadDataFromStorage()
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data Berhasil Disimpan')
})

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTodo = document.getElementById("todos");
  const completedTodo = document.getElementById("completed-todos");
  
  uncompletedTodo.innerHTML = "";
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


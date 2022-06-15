"use strict";
const btnAdd = document.querySelector("#btn-add");
const inpAdd = document.querySelector("#inp-add");

// display todo
showTodo();

btnAdd.addEventListener("click", function (e) {
  e.preventDefault();
  const todoList = localStorage.getItem("todo-list");
  let todoListObj;
  if (todoList === null) {
    todoListObj = [];
  } else {
    todoListObj = JSON.parse(todoList);
  }
  if (inpAdd.value == "") showAlert("alert", "Please add todo");
  else {
    todoListObj.push({ todo: inpAdd.value, id: generateRandomId() });
    // show alert
    showAlert("success", "Todo added");
    localStorage.setItem("todo-list", JSON.stringify(todoListObj));
    inpAdd.value = "";
    showTodo();
  }
});

// generates random id
function generateRandomId() {
  return Math.floor(Math.random() * 10000000);
}

// show todo
function showTodo() {
  const todoList = localStorage.getItem("todo-list");
  let todoListObj;
  if (todoList === null) {
    todoListObj = [];
  } else {
    todoListObj = JSON.parse(todoList);
  }
  let html = "";

  todoListObj.forEach((todo, index) => {
    html += `
    <div class="todo__list-item mb-3 ">
      <div class="right">
          <span id="index">${index + 1} . </span>
          <input class="form-check-input checkbox" type="checkbox" id="${
            todo.id
          }">
          <label class="form-check-label todo-list-label" for=${
            todo.id
          } id="todo-task-label">
              ${todo.todo}</label>
      </div>
      <div class="left">
          <i class="fas delete  fa-trash"></i>
          <i class="fas edit fa-edit"></i>
      </div>
  </div>
  `;
  });

  const container = document.querySelector(".todo__list-container");
  container.innerHTML = html;
}

// root add event listners
// //////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("click", function (e) {
  const target = e.target.closest(".todo__list-item");

  // for complete note function
  if (e.target.classList.contains("checkbox")) {
    if (e.target.checked) {
      target.classList.add("completed");
    } else {
      target.classList.remove("completed");
    }
  }

  // delete note
  if (e.target.classList.contains("delete")) {
    deleteTodo(target.querySelector(".checkbox"));
  }

  // edit todo
  if (e.target.classList.contains("edit")) {
    editTodo(target, target.querySelector(".checkbox"));
  }
});

// delete note
function deleteTodo(todo) {
  const todoList = JSON.parse(localStorage.getItem("todo-list"));
  const newTodo = todoList.filter((elem) => elem.id != todo.id);
  localStorage.setItem("todo-list", JSON.stringify(newTodo));
  showTodo();
  showAlert("alert", "Todo deleted");
}

// edit todolist
function editTodo(target, todo) {
  const todoList = JSON.parse(localStorage.getItem("todo-list"));
  let text = target.querySelector(".todo-list-label").innerText;
  todoList.forEach((elem) => {
    if (elem.id == todo.id) {
      const textArea = document.querySelector(".text-area");
      const btn = document.querySelector(".update-btn");
      const modal = document.querySelector(".edit-modal");
      modal.classList.remove("hidden");
      textArea.value = text;

      // event listner on update button;
      btn.addEventListener("click", function () {
        elem.todo = textArea.value;
        modal.classList.add("hidden");
        localStorage.setItem("todo-list", JSON.stringify(todoList));
        showTodo();
        showAlert("success", "Todo updated");
      });
    }
  });
}

// This is for showing alerts
function showAlert(status, msg) {
  const html = `
    <div class="alert-con container">
          <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                  <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </symbol>
          </svg>

          <div class="alert alert-${status} d-flex align-items-center w-25 justify-content-start" role="alert">
              <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                  <use xlink:href="#check-circle-fill" />
              </svg>
              <div>
                  ${msg}
              </div>
          </div>
      </div>
  `;

  const body = document.querySelector("body");
  body.insertAdjacentHTML("afterbegin", html);

  setTimeout(() => {
    document.querySelector(".alert-con").remove();
  }, 1500);
}

// delte all functionality //////////////////////////////////////////////
const deleteCompleted = document.querySelector(".delete-completed");

deleteCompleted.addEventListener("click", function () {
  const todoList = JSON.parse(localStorage.getItem("todo-list"));
  const allTodo = document.querySelectorAll(".checkbox");
  const arr = [];

  allTodo.forEach((todo, index) => {
    if (todo.checked == true) {
      arr.push(todoList[index]);
    }
  });

  const newTodoList = todoList.filter((elem) => {
    return arr.indexOf(elem) === -1;
  });

  if (todoList.length === newTodoList.length) {
    showAlert("alert", "Nothing is completed");
  } else {
    showAlert("success", "All completed Delted");
  }
  localStorage.setItem("todo-list", JSON.stringify(newTodoList));
  showTodo();
});

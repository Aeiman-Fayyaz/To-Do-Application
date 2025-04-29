// Logic
document.addEventListener("DOMContentLoaded", () => {
  // Inputfield element
  const taskInput = document.getElementById("text");
  // Add button element
  const addBtnTask = document.getElementById("task-add-btn");
  // Ul element
  const taskList = document.getElementById("taskList");
  // Empty image elemnt for removing when task list add
  const emptyImg = document.querySelector(".empty-img");

  // To Do Container
  const toDosContainer = document.querySelector(".to-doContainer")

  // Create function for removing Image using CSS here by making variable
  const removeImg = () => {
    emptyImg.style.display = taskList.children.length === 0 ? "block" : "none";

  };


  // Create Function
  const addTask = (text , completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      Swal.fire({
        icon: "error",
        title: "Please enter your task",
        // text: "Something went wrong!",
        // footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }
    
    // Li create in HTML
    const li = document.createElement("li");

    // Design li also edit & delete button
    li.innerHTML = `
    <input type = "checkbox" class = "checkbox" ${completed ? "checked" : ''}/>
    <span> ${taskText} </span>
    <div class = "task-buttons">
          <button class = "edit-btn"><i class="fa-solid fa-file-pen" style="color: #ffffff;"></i></button>
          <button class = "dlt-btn"><i class="fa-solid fa-trash-can" style="color: #ffffff;"></i></button>
    </div>
    `

    // Function for edit button
    const checkbox = li.querySelector(".checkbox")
    const editBtn = li.querySelector(".edit-btn")

    // Logic for task completed
    if(completed){
      li.classList.add(' completed')
      editBtn.disabled = true
    }

    checkbox.addEventListener("change" , () => {
      const ischecked = checkbox.checked
      li.classList.toggle("completed" , ischecked)
    })

    editBtn.addEventListener("click" , () => {
      if(!checkbox.checked){
        taskInput.value = li.querySelector("span").textContent
        li.remove()
        removeImg()
      }
    })
    // Function for delete button
    li.querySelector(".dlt-btn").addEventListener("click" , () =>{
      li.remove()
      removeImg()
    })

    taskList.appendChild(li);
    taskInput.value = "";
    removeImg();
  };

  // Button logic create
  addBtnTask.addEventListener("click",() =>  addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTask();
    }
  });
});

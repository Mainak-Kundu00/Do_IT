document.addEventListener("DOMContentLoaded", () => {
    // console.log("content loaded");
    const form = document.getElementById("todo-form");
    const task_container = document.getElementById("todo-list");
    const clear = document.getElementById("clear-completed");
    const count = document.getElementById("total-count");

    //if localstorage have any item then it loades into tasks or loads an empty array
    let tasks = JSON.parse(localStorage.getItem('task')) || [];

    //loading task in the web
    loadTask();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        //getting the input value
        const input = document.getElementById("todo-input").value.trim();
        
        //creating an todo item 
        createTask(input);
    });
    
    function createTask(input){
        if(input === "") return;
        
        const item = {
            id: Date.now(),
            text: input,
            completed: false
        }
        tasks.push(item);
        
        //saving task to localstorage
        saveTask();
        renderTask();
        //reseting the input field after submiting input
        document.getElementById("todo-input").value = "";
    }

    function loadTask(){ 
        if(tasks.length === 0){
            const div = document.createElement("div");
    
            div.innerHTML = '<div class="text-center py-4 text-gray-500">No tasks yet. Add one above!</div>';
            task_container.appendChild(div);
        }
        else{
            tasks.forEach((item) => renderTask(item));
        }
    }
     

    function saveTask(){
        localStorage.setItem('task',JSON.stringify(tasks));
    }

    function renderTask(item){
        const div = document.createElement("div");
        
       
        div.setAttribute('item_id', item.id);
        div.innerHTML = `
        <span>${item.text}</span>
        <button>delete</button>
        `;
        task_container.appendChild(div);
    }
});
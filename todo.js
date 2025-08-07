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

    task_container.addEventListener("click", (e) => {
        if(e.target.matches("INPUT[TYPE=CHECKBOX]")){
            // console.log(e.target.parentElement);

        }
        if(e.target.checked) {
            // console.log("hi");
        }
        
        
    });
    
    function createTask(input){
        //if input is empty
        if(input === "") {
            alert("Add a task");
            return;
        }
        
        const item = {
            id: Date.now(),
            text: input,
            completed: false
        }
        tasks.push(item);
        
        //saving task to localstorage
        saveTask();
        //reseting the input field after submiting input
        document.getElementById("todo-input").value = "";
    }

    function loadTask(){ 
         if(tasks.length === 0){
            const div = document.createElement("div");

            div.innerHTML = '<div class="text-center py-4 text-gray-500">No tasks yet. Add one above!</div>';
            
            task_container.appendChild(div);
            count.innerHTML = `0 items`;
        }else{
            tasks.forEach((item) => renderTask(item));
        }
    }
     

    function saveTask(){
        localStorage.setItem('task',JSON.stringify(tasks));
        task_container.innerHTML = "";
        loadTask();
    }

    function renderTask(item){
        const div = document.createElement("div");
        div.setAttribute('item_id', item.id);
        div.innerHTML = `
            <input type="checkbox" name="completed">
            <span>${item.text}</span>
            <button class="float-right text-red-500"> 
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
            `;
        task_container.appendChild(div);
        count.innerHTML = `${tasks.length} items` ;

        div.addEventListener('click', (e) => {
            //if clicked on the button
            if(e.target.closest("button")){
                //returns tasks except the one is being clicked
                tasks = tasks.filter(task => task.id !== item.id);
                //removing the cliked task
                div.remove();
                saveTask();
            }            
        })
    }
});
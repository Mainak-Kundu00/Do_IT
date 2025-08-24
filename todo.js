//// unfinished voice recognition work due to device issue
document.addEventListener("DOMContentLoaded", () => {
    
    // for loginform button
    const openForm = document.getElementById('open-form');
    const closeForm = document.getElementById('close-form');
    const loginForm = document.getElementById('login-modal');

    // for add task button 
    const openBtn = document.getElementById('open-modal-btn');
    const modal = document.getElementById('modal');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const closeBtn = document.getElementById('close-modal-btn');
    
    //for voice input button
    const voiceBtn = document.getElementById('voice-command-btn');
    const voiceModel = document.getElementById('voice-modal');
    const voicePanel = document.getElementById('voice-panel');
    const voiceClosebtn = document.getElementById('close-voice-btn');
    const voiceInput = document.getElementById('start-voice-btn');
    const heard = document.getElementById('voice-heard');

    // for todo list work 
    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const category = document.getElementById("todo-category");
    const task_container = document.getElementById("todo-list");
    const clear = document.getElementById("clear-completed");
    const count = document.getElementById("total-count");
    
    //if localstorage have any item then it loades into tasks or loads an empty array
    let tasks = JSON.parse(localStorage.getItem('task')) || [];
    
////////// /////////// /////////// 
    console.log(category.value);
    
    //loading task in the web
    loadTask();
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        //getting the input value
        const input = document.getElementById("todo-input").value.trim();
        
        //creating an todo item 
        createTask(input);
        closeModal();
    });
    
    //Login form button
    openForm.addEventListener('click', () => {
        const emailInput = document.getElementById('email');

        loginForm.classList.remove('hidden')
        document.body.classList.add('overflow-hidden');
        
        setTimeout(() => emailInput.focus(), 50);
    });
    closeForm.addEventListener('click', () => {
        loginForm.classList.add('hidden')
        document.body.classList.remove('overflow-hidden');
    });
    loginForm.addEventListener('click', (e) => {
        if (e.target === loginForm) {
            loginForm.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });
    
    // Add Task button
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    //Voice Button(whole voice panel)
    voiceBtn.addEventListener('click', () => {
        voiceModel.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        // Animate in
        requestAnimationFrame(() => {
            voicePanel.classList.remove('opacity-0', 'scale-95');
            voicePanel.classList.add('opacity-100', 'scale-100');
        });

    })
    voiceClosebtn.addEventListener('click', () => {
        voicePanel.classList.add('opacity-0', 'scale-95');
        voicePanel.classList.remove('opacity-100', 'scale-100');

        setTimeout(() => {
            voiceModel.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            heard.innerText = "";
        }, 200);
    })
    voiceModel.addEventListener('click', (e) => {
        if (e.target === voiceModel) {
            voicePanel.classList.add('opacity-0', 'scale-95');
                voicePanel.classList.remove('opacity-100', 'scale-100');

                setTimeout(() => {
                    voiceModel.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                    heard.innerText = "";
                }, 200);
        }
    });

    //voice input(recognition) work
    voiceInput.addEventListener('click', () => {
        //getting the speech recognition which is available
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        //if voice not supported
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        // creating object of the browser supported recognizer and defining properties
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        
        //starting the recording 
        recognition.start();
        voiceInput.textContent = "Listening .... 🎙️";
        voiceInput.disabled = true;

        // remember its a function variable (look closely on the next line)
        recognition.onresult = (e) => {
            const result = e.results[0][0].transcript.toLowerCase();
            //showing what browser heard
            heard.innerText = `Heard: ${result}`;

            voiceInput.textContent = "🎤 Start Listening";
            voiceInput.disabled = false;
        };

        //if any error occurs
        recognition.onerror = (event) => {
            console.error('Voice error:', event.error);
            
            voiceInput.textContent = 'Start Listening';
            voiceInput.disabled = false;
            alert('Voice recognition failed. Try again.');
        };
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }else if(e.key === 'Escape' && !loginForm.classList.contains('hidden')){
            loginForm.classList.add('hidden');
        }else if(e.key === 'Escape' && !voiceModel.classList.contains('hidden')){
            voiceModel.classList.add('hidden');
        }
    });
    
    //clearing all completed item in one go
    clear.addEventListener("click", () => {
        tasks.forEach(item => {
            if (item.completed) {
                const div = document.querySelector(`[item_id="${item.id}"]`);
                if (div) div.remove(); // removes from DOM
            }
        });
        //removes from array
        tasks = tasks.filter(item => !item.completed);
        saveTask(); 
    });

    // Modal controls
    function openModal() {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        // Tiny enter animation
        requestAnimationFrame(() => {
            panel.classList.remove('scale-95');
            panel.classList.add('scale-100');
        });

        // Focus input for quick typing and setTimeout is used to prevent timing missmatch with the modal 
        setTimeout(() => input.focus(), 50);
    }

    function closeModal() {
        // Tiny exit animation
        panel.classList.add('scale-95');
        panel.classList.remove('scale-100');

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            form.reset();
        }, 150);
    }

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
        task_container.innerHTML = "";
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
        loadTask();
    }

    function renderTask(item){
        //creating an item
        const div = document.createElement("div");
        //creating the tailwind classes
        const taskClasses = "bg-white shadow-sm rounded-md px-4 py-2 mb-2 border border-gray-200 hover:bg-gray-300 transition-all duration-200";
        
                
        div.classList.add(...taskClasses.split(" "));
        div.setAttribute('item_id', item.id);
        div.innerHTML = `
        <input type="checkbox" name="completed">
        <span class="ml-1.5">${item.text}</span>
        <button class="float-right text-red-500 hover:text-red-700"> 
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        </button>
        `;
        // if item available and completed then checks the checkbox on render
        if (item.completed) {
            div.classList.add("line-through", "text-gray-400", "opacity-50");
            const checkbox = div.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = true;
        }
        //adding item to the task container and updating the counter
        task_container.appendChild(div);
        count.innerHTML = `${tasks.length} items` ;
        
        //removing an task
        deleteTask(div,item);

        
        //working with checkbox
        div.addEventListener("click", (e) => {
            const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
            const divId = e.currentTarget.getAttribute("item_id");

            //browser handles checkbox clicking ensuring there is no double toggle
            if(e.target.matches('input[type="checkbox"]')) {            
                addClass(div,divId);
                return;
            }
        
            //clicking the div changes the checkbox status
            checkbox.checked = !checkbox.checked;
            addClass(div,divId);
        });
    }

    function addClass(div,divId){
        const completedTask = tasks.find((t) => t.id == divId);

        if(!completedTask) return;
        completedTask.completed = !completedTask.completed;
        
        if(completedTask.completed){
            div.classList.add("line-through", "text-gray-400","opacity-50");    
        }else{
            div.classList.remove("line-through", "text-gray-400","opacity-50");
        }
        //save the task
        saveTask();
    }

    function deleteTask(div,item){
        div.addEventListener('click', (e) => {
            //if clicked on the button
            if(e.target.closest("button")){
                //returns tasks except the one is being clicked
                tasks = tasks.filter(task => task.id !== item.id);
                //removing the clicked task
                div.remove();
                saveTask();
            }            
        });
    }
});
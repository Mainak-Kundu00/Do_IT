document.addEventListener("DOMContentLoaded", () => {
    //there are some bugs in category related work (check in ph not desktop)
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
    const task_container = document.getElementById("todo-list");
    const clear = document.getElementById("clear-completed");
    const count = document.getElementById("total-count");
    
    //category work
    const categoryList = document.getElementById('category-list');
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    const categoryToggle = document.getElementById('category-toggle');
    const menuCategoryList = document.getElementById('menu-category-list');
    const dropArrow = document.getElementById('arrow');
    const addCategoryButton = document.getElementById('add-category-btn');

    let hasRendered = false;

    //if localstorage have any item then it loades into tasks or loads an empty array
    let tasks = JSON.parse(localStorage.getItem('task')) || [];
    let categories = JSON.parse(localStorage.getItem('categories')) || [];

    let tasksCopy = tasks;

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
    
    function closeVoiceModal(){
        voicePanel.classList.add('opacity-0', 'scale-95');
        voicePanel.classList.remove('opacity-100', 'scale-100');
        
        setTimeout(() => {
            voiceModel.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            heard.innerText = "";
        }, 200);
        
        //if voice model closed while browser listening
        voiceInput.textContent = "🎤 Start Listening";
        voiceInput.disabled = false;
    }
    
    function createTask(input,category){
        //if input is empty
        if(input === "") {
            alert("Add a task");
            return;
        }
        
        const item = {
            id: Date.now(),
            text: input,
            category: category,
            completed: false
        }
        tasks.push(item);
        //if category isn't empty and not in the list then add it in the list
        if(category){
            let hasCategory = categories.filter(cat => cat==category);
            if(hasCategory){
                categories.push(category);
                saveCategories();
                addCategoryDropDown(category);
                addCategories(category);
            }
        }

        //saving task to localstorage
        saveTask();
        //reseting the input field after submiting input
        document.getElementById("todo-input").value = "";
        document.getElementById("todo-category").value = "";
    }
    
    function loadTask(){ 
        task_container.innerHTML = "";
         if(tasks.length === 0){
            const div = document.createElement("div");
    
            div.innerHTML = '<div class="text-center py-4 text-gray-500">No tasks yet. Add one above!</div>';
            
            task_container.appendChild(div);
            count.innerHTML = `0 items`;
        }else{
            const button = document.querySelector("button[category='All']");
                    
            button.classList.add("bg-blue-400");
            button.classList.remove("bg-gray-300");
            //loop through other categories to remove class from other categories 
            categories.forEach((cat) => {
                let category = document.querySelector(`button[category= "${cat}"]`);
                    
                if(category){
                    category.classList.remove("bg-blue-400");
                    category.classList.add("bg-gray-300");                    
                }
            });
            tasks.forEach((item) => renderTask(item));
        }
    }

    //its only purpose is to show the category UI
    function loadTaskByFilter(){ 
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

    function loadCategories()
    {
      const li = document.createElement('li');

      categoryList.innerHTML = "";
      
      li.innerHTML = `<button category='All' class="p-1.5 font-semibold bg-blue-400 text-sm hover:bg-blue-300">All</button>`;
      categoryList.appendChild(li);

      categories.forEach((item) => addCategories(item));
    }
    
    function saveCategories(){
        localStorage.setItem('categories',JSON.stringify(categories));
    }
    
    function addCategories(item){
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.setAttribute('category',item.trim());
        button.textContent = item.trim();
        button.className = "p-1.5 bg-gray-300 font-semibold whitespace-nowrap text-sm  hover:bg-blue-300";        
      
        li.appendChild(button);       
        categoryList.appendChild(li);
    }
    
    function closeDropdown(){
      //rotates the arrow 
      dropArrow.classList.remove('rotate-180');
      //animation of the dropdown closing
      menuDropdown.classList.remove('opacity-100', 'scale-100');
      menuDropdown.classList.add('opacity-0', 'scale-95');
      //hiding the whole dropdown with matching the duration of the animation
      setTimeout(() => {
        menuCategoryList.classList.add('hidden');
        menuDropdown.classList.add('hidden');
      }, 200);
    }

    function addCategoryDropDown(item){
      const li = document.createElement('li');

      li.className = "flex justify-between items-center text-sm text-gray-700";
      li.innerHTML = `<span>${item}</span>
            <button id="delete-category" class="float-right text-red-500 hover:text-red-700"> 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>`;

      menuCategoryList.insertBefore(li,addCategoryButton.parentElement);
    }


    function fliterTaskByCategory(categoryType){
        let category = categoryType.getAttribute('category')

        tasks = tasks.filter(t => t.category==category);

        loadTaskByFilter();
        //reloading the tasks from the local storage
        tasks = tasksCopy;
    }
    
    //load categories
    loadCategories();
    //loading task in the web     
    loadTask();        

    categoryList.addEventListener('click', (e) => {
        if(e.target.tagName !== "UL"){
            let categoryType = e.target;
            let allCategory = document.querySelector("button[category='All']");
            
            if(categoryType.getAttribute('category') === 'All'){
                allCategory.classList.add("bg-blue-400");
                allCategory.classList.remove("bg-gray-300");
                //loop through other categories to 
                categories.forEach((cat) => {
                    let category = document.querySelector(`button[category= "${cat}"]`);
                    
                    category.classList.remove("bg-blue-400");
                    category.classList.add("bg-gray-300");                    
                });

                loadTask();
            }
            else{
                allCategory.classList.remove("bg-blue-400");
                allCategory.classList.add("bg-gray-300");
                //loop through other categories
                categories.forEach((cat) => {
                    let category = document.querySelector(`button[category= "${cat}"]`);
                    
                    category.classList.remove("bg-blue-400");
                    category.classList.add("bg-gray-300");                    
                });

                categoryType.classList.remove("bg-gray-300");
                categoryType.classList.add("bg-blue-400");
                fliterTaskByCategory(categoryType);
            }   
            
        }
    });

    //add categories
    addCategoryButton.addEventListener('click', () => {
        const newCategory = prompt("Enter new category name:");
        if (!newCategory.trim() || categories.includes(newCategory.trim())) return;

        addCategories(newCategory);
        addCategoryDropDown(newCategory);

        categories.push(newCategory);
        saveCategories();
    });

    // Toggle dropdown menu
    menuToggle.addEventListener('click', () => {
      const isVisible = menuDropdown.classList.contains('opacity-0');
      
      if (isVisible) {
        menuDropdown.classList.remove('hidden');
        requestAnimationFrame(() => {
          menuDropdown.classList.add('opacity-100', 'scale-100');
          menuDropdown.classList.remove('opacity-0', 'scale-95');
        });
      } else {
         closeDropdown();
      }
    });

    // if clicked on outside of the dropdown
    document.addEventListener('click', (e) => {
      const isClickInsideMenu = menuDropdown.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);

      if (!isClickInsideMenu && !isClickOnToggle)closeDropdown();
    });

    // Toggle category list
    categoryToggle.addEventListener('click', () => {

      menuCategoryList.classList.toggle('hidden');
      dropArrow.classList.toggle('rotate-180');

      //rendering the categories in the dropdown list
      if(!hasRendered){
        categories.forEach(item => addCategoryDropDown(item));
        hasRendered = true;
      }

    });
    
    //delete category
    menuCategoryList.addEventListener('click', (e) => {
        const deleteBtn = e.target.parentElement;

        
        if(deleteBtn.tagName.toLowerCase() === 'svg'){

          const li = deleteBtn.closest('li');
          const categoryName = li.querySelector('span').textContent;
          
          // Remove from DOM
          li.remove();

          // Update categories array and localStorage
          categories = categories.filter(cat => cat != categoryName);
          saveCategories();

          //reload categories
          loadCategories();
        }
        else {return}
    });
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        //getting the input value
        const input = document.getElementById("todo-input").value.trim();
        const category = document.getElementById("todo-category").value.trim(); 
        
        //creating an todo item 
        createTask(input,category);
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
        closeVoiceModal();
    })
    voiceModel.addEventListener('click', (e) => {
        if (e.target === voiceModel) {
            closeVoiceModal();
        }
    });
///////////// ongoing work /////////////////
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

            if(result.startsWith('add task')){
                const taskText = result.replace("add task", '').trim();
                if(taskText){
                    createTask(taskText,null);
                }
            }else{
                closeModal();
            }
            
            voiceInput.textContent = "🎤 Start Listening";
            voiceInput.disabled = false;
        };

        //if any error occurs
        recognition.onerror = (event) => {
            console.error('Voice error:', event.error);
            
            voiceInput.textContent = '🎤 Start Listening';
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

});
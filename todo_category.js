document.addEventListener("DOMContentLoaded", () => {
  
  const categoryList = document.getElementById("category-list");
  const menuToggle = document.getElementById('menu-toggle');
  const menuDropdown = document.getElementById('menu-dropdown');
  const categoryToggle = document.getElementById('category-toggle');
  const menuCategoryList = document.getElementById('menu-category-list');
  const dropArrow = document.getElementById('arrow');
  const addCategoryButton = document.getElementById('add-category-btn');
  
  let categories = JSON.parse(localStorage.getItem('categories')) || [];
  let hasRendered = false;
    
    //load categories
    categories.forEach((item) => addCategories(item));
    
    function saveCategories(){
        localStorage.setItem('categories',JSON.stringify(categories));
    }
    
    function addCategories(item){
        const li = document.createElement('li');
        const button = document.createElement('button');
    
        button.textContent = item.trim();
        button.className = "p-1.5 bg-gray-200 font-semibold text-sm hover:bg-gray-300";        
      
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
        const deleteBtn = e.target.closest('button');
        
        if (deleteBtn) {
          const li = deleteBtn.closest('li');
          const categoryName = li.querySelector('span').textContent;

          // Remove from DOM
          li.remove();

          // Update categories array and localStorage
          categories = categories.filter(cat => cat != categoryName);
          saveCategories();
        }
    });

});
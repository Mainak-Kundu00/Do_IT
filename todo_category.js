document.addEventListener("DOMContentLoaded", () => {

    const categoryList = document.getElementById("category-list");
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    const categoryToggle = document.getElementById('category-toggle');
    const menuCategoryList = document.getElementById('menu-category-list');
    const dropArrow = document.getElementById('arrow');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    //load categories
    categories.forEach((item) => addCategories(item));

    document.getElementById("add-category-btn").addEventListener('click', () => {
        const newCategory = prompt("Enter new category name:");
        if (!newCategory.trim()) return;

        addCategories(newCategory);

        categories.push(newCategory);
        saveCategories();
    });

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
      menuDropdown.classList.remove('opacity-100', 'scale-100');
      menuDropdown.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        menuDropdown.classList.add('hidden');
      }, 200);
    }


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
        // Match duration
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
    });















    
});
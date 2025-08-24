document.addEventListener("DOMContentLoaded", () => {

    const categoryList = document.getElementById("category-list");
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
        button.className = "p-1.5 bg-gray-200 font-bold text-sm hover:bg-gray-300";        

        li.appendChild(button);       
        categoryList.appendChild(li);
    }
    
});
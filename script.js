document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const body = document.body;

    // Load saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        toggleBtn.src = "images/icon-moon.svg";
    }

    // Toggle theme on button click
    toggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            toggleBtn.src = "images/icon-sun.svg";
        } else {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            toggleBtn.src = "images/icon-moon.svg";
        }
    });

    // Initialize todo item functionality
    function addTodoItem() {
        const todoItem = document.getElementById('todo-item');
        const whatTodoInput = document.getElementById('what-todo');
        const clearCompletedButton = document.getElementById('clear-completed');

        // Add event listener for Enter key press in the input field
        whatTodoInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addItemFromInput();
            }
        });

        // Add event listener for the Clear Completed button
        if (clearCompletedButton) {
            clearCompletedButton.addEventListener('click', () => {
                const completedItems = todoItem.querySelectorAll('.completed');
                completedItems.forEach(item => item.remove());
                updateItemsLeft();
            });
        }

        // Function to create and append a new todo item
        function addItemFromInput() {
            const whatTodo = whatTodoInput.value.trim();

            if (whatTodo) {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.draggable = true; // Make the item draggable

                // Create checkbox
                const itemCheckbox = document.createElement('input');
                itemCheckbox.type = 'checkbox';
                itemCheckbox.className = 'todo-item-checkbox';
                itemCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        li.classList.add('completed');
                        moveToBottom(li);
                    } else {
                        li.classList.remove('completed');
                    }
                    updateItemsLeft();
                });

                // Create span for todo text
                const span = document.createElement('span');
                span.className = 'todo-item-text';
                span.textContent = whatTodo;

                // Append checkbox and span to the list item
                li.appendChild(itemCheckbox);
                li.appendChild(span);

                // Append list item to the todo list
                todoItem.appendChild(li);

                // Clear input field
                whatTodoInput.value = '';
                updateItemsLeft();
            } else {
                console.log('Input is empty');
            }
        }

        // Function to move completed items to the bottom of the list
        function moveToBottom(item) {
            todoItem.appendChild(item);
        }

        // Function to update the items left counter
        function updateItemsLeft() {
            const itemsLeft = todoItem.querySelectorAll('li').length;
            document.getElementById('items-left').textContent = `${itemsLeft} item${itemsLeft !== 1 ? 's' : ''} left`;
        }

        // Initialize items left counter
        updateItemsLeft();

        // Drag and drop functionality
        let draggedItem = null;

        todoItem.addEventListener('dragstart', (event) => {
            draggedItem = event.target;
            event.target.classList.add('dragging');
        });

        todoItem.addEventListener('dragend', (event) => {
            event.target.classList.remove('dragging');
            draggedItem = null;
        });

        todoItem.addEventListener('dragover', (event) => {
            event.preventDefault();
            const afterElement = getDragAfterElement(todoItem, event.clientY);
            if (afterElement == null) {
                todoItem.appendChild(draggedItem);
            } else {
                todoItem.insertBefore(draggedItem, afterElement);
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    // Initialize todo item functionality
    addTodoItem();
});

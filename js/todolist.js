;(function(){
    // ARMAZENAR O DOM EM VARIÁVEIS
    const todoAddForm = document.querySelector('#todo-add');
    const itemInput = document.querySelector('#item-input');
    const ul = document.querySelector('#todo-list');
    const lis = ul.getElementsByTagName('li');

    let arrayTasks = getSavedData();

    // ADICIONAR NOVOS ITENS NA UL APÓS O CLIQUE NO 'ADD'

    // function addEventLi(li) {
    //     li.addEventListener('click', (evt) => {
    //         console.log('clicou');
    //     })
    // }

    function getSavedData() {
        let tasksData = localStorage.getItem('tasks');
        tasksData = JSON.parse(tasksData);
        return tasksData && tasksData.length ? tasksData : [
            {
                name: 'task 1',
                createdAt: Date.now(),
                completed: false
            },
            {
                name: 'task 2',
                createdAt: Date.now(),
                completed: false
            },
            {
                name: 'task 3',
                createdAt: Date.now(),
                completed: false
            },
            {
                name: 'task 4',
                createdAt: Date.now(),
                completed: false
            }
        ]
    }

    function setNewData() {
        localStorage.setItem('tasks', JSON.stringify(arrayTasks));
    }

    setNewData();

    function generateLiTask(obj) {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const checkButton = document.createElement('button');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        li.className = 'todo-item';

        checkButton.className = 'button-check';
        checkButton.innerHTML = `<i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`;
        checkButton.setAttribute('data-action', 'checkButton');
        
        li.appendChild(checkButton);

        p.className = 'task-name';
        p.textContent = obj.name;
        li.appendChild(p);

        editButton.className = 'fas fa-edit';
        editButton.setAttribute('data-action', 'editButton');
        li.appendChild(editButton);

        const containerEdit = document.createElement('div');
        containerEdit.className = 'editContainer';
        const inputEdit = document.createElement('input');
        inputEdit.setAttribute('type', 'text');
        inputEdit.className = 'editInput';
        inputEdit.value = obj.name;
        containerEdit.appendChild(inputEdit);
        const containerEditButton = document.createElement('button');
        containerEditButton.className = 'editButon';
        containerEditButton.textContent = 'Edit';
        containerEditButton.setAttribute('data-action', 'containerEditButton');
        containerEdit.appendChild(containerEditButton);
        const containerCancelButton = document.createElement('button');
        containerCancelButton.className = 'cancelButton';
        containerCancelButton.textContent = 'Cancel';
        containerCancelButton.setAttribute('data-action', 'containerCancelButton');
        containerEdit.appendChild(containerCancelButton);

        li.appendChild(containerEdit);

        deleteButton.className = 'fas fa-trash-alt';
        deleteButton.setAttribute('data-action', 'deleteButton');
        li.appendChild(deleteButton);

        // addEventLi(li);

        return li
    }

    function renderTasks() {
        ul.innerHTML = '';
        arrayTasks.forEach(task => {
            ul.appendChild(generateLiTask(task));
        });
    }

    function addTask(task) {
        arrayTasks.push({
            name: task,
            createdAt: Date.now(),
            completed: false
        })

        setNewData();
    }

    function clickedUl(e) {
        let dataAction = e.target.getAttribute('data-action');

        if (!dataAction) {
            return
        }

        let currentLi = e.target;
        while(currentLi.nodeName !== 'LI') {
            currentLi = currentLi.parentElement;
        }
        

        const currentLiIndex = [...lis].indexOf(currentLi);

        const actions = {
            editButton: function() {                
                const editContainer = currentLi.querySelector('.editContainer');
                [...lis].forEach(function(item) {
                    item.querySelector('.editContainer').style.display = 'none';
                })
                editContainer.style.display = 'flex';
                
            },
            containerCancelButton: function() {                
                currentLi.querySelector('.editContainer').style.display = 'none';
                currentLi.querySelector('.editInput').value = arrayTasks[currentLiIndex].name;
            },
            deleteButton: function() {                
                arrayTasks.splice(currentLiIndex, 1);
                renderTasks();
                setNewData();
            },
            checkButton: function() {                
                arrayTasks[currentLiIndex].completed = !arrayTasks[currentLiIndex].completed;
                if (arrayTasks[currentLiIndex].completed) {
                    currentLi.querySelector(".fa-check").classList.remove("displayNone");
                }
                else {
                    currentLi.querySelector(".fa-check").classList.add("displayNone");
                }
                renderTasks();
                setNewData();
            },
            containerEditButton: function() {
                const val = currentLi.querySelector('.editInput').value;
                arrayTasks[currentLiIndex].name = val;
                renderTasks();
                setNewData();
            }
        }

        if (actions[dataAction]) {
            actions[dataAction]();
        }
    }

    todoAddForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    addTask(itemInput.value);
    renderTasks();
    itemInput.value = "";
    itemInput.focus(); 
    });

    ul.addEventListener('click', clickedUl);

    renderTasks();
    
})()
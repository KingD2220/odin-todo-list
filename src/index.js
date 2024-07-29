import './styles.css'
import { format, compareAsc, parse } from "date-fns";

class ProjectList {
    static projectList = [];
    static currentProject;

    static get currentProject() {
        return ProjectList.currentProject;
    }

    static set currentProject(project) {
        ProjectList.currentProject = project;
    }

    static addProject(project) {
        ProjectList.projectList.push(project);
    }

    static get projectList() {
        return ProjectList.projectList;
    }
}


class Project {
    todoList = [];


    constructor(title) {
        this.title = title;
    }

    addItem(item) {
        this.todoList.push(item);
    }

    removeItem(item) {
        this.todoList.splice(this.todoList.indexOf(item), 1);
    }

    sortByDate() {
        this.todoList.sort((a, b) => compareAsc(a.dueDate, b.dueDate));
    }
}

class TodoItem {
    constructor(title, description, dueDate, priority, projectName) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.projectName = projectName;

        this._id = TodoItem.incrementId();
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId++;
        return this.latestId;
    }
}

//Display
class Display {

    static projectContainer = document.querySelector('.project-container');
    static projectButtonsContainer = document.querySelector('.project-buttons');

    static renderProject(project, displayChecked) {
        //Display project title
        const title = document.createElement('h1');
        title.classList.add('project-title');
        title.textContent = project.title;
        Display.projectContainer.appendChild(title);

        //Add task button
        const add = document.createElement('button');
        add.type = 'button';
        add.textContent = '+';
        add.addEventListener('click', () => {
            FormController.generateProjectSelection();
            FormController.addButtonForm();
        });
        Display.projectContainer.appendChild(add);

        //Render todo items
        for (let item of project.todoList) {
            if (item.completed != displayChecked) { //Skips completed/uncompleted items based on the filter
                continue;
            }
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.classList.add(`${item.priority}`); //priority
            itemDiv.setAttribute('id', `${item._id}`);

            if (item.completed) {
                itemDiv.classList.add('checked');
            }

            //Checkbox toggle
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.checked = item.completed || false;
            check.addEventListener('change', () => {
                check.parentNode.classList.toggle('checked');
                FormController.setCompletedItem(check.parentNode.id, check.parentNode.querySelector('.parent-project').textContent, check.checked);
                Display.resetProjectDisplay();
                Display.renderProject(project, displayChecked);
            });
            itemDiv.appendChild(check);

            //Task Info
            const taskInfoDiv = document.createElement('div');
            taskInfoDiv.classList.add('task-info');

            const title = document.createElement('h3');
            title.textContent = item.title;

            const desc = document.createElement('p');
            desc.classList.add('desc');
            desc.textContent = item.description;

            const date = document.createElement('p');
            date.classList.add('date')
            const parsedDate = FilterController.parseDateString(item.dueDate);
            const formattedDate = format(parsedDate, 'MMM dd yyyy');
            date.textContent = formattedDate;

            taskInfoDiv.appendChild(title);
            taskInfoDiv.appendChild(desc);
            taskInfoDiv.appendChild(date);

            itemDiv.appendChild(taskInfoDiv);

            //Edit and Delete Buttons

            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add('task-buttons');

            const editButton = document.createElement('button')
            editButton.classList.add('edit');
            editButton.type = 'button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', (e) => {
                const itemNode = e.target.parentNode.parentNode;
                FormController.editItemForm(itemNode.id, itemNode.querySelector('.parent-project').textContent);
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (e) => {
                const itemNode = e.target.parentNode.parentNode;
                FormController.deleteItem(itemNode.id, itemNode.querySelector('.parent-project').textContent);
            });

            buttonDiv.appendChild(editButton);
            buttonDiv.appendChild(deleteButton);

            itemDiv.appendChild(buttonDiv);


            const projectName = document.createElement('p');
            projectName.classList.add('parent-project');
            projectName.textContent = item.projectName;

            itemDiv.appendChild(projectName);

            Display.projectContainer.appendChild(itemDiv);
        }
    }

    static resetProjectDisplay() {
        Display.projectContainer.innerHTML = '<h1 class="project-title"></h1>';
    }

    static renderProjectList() {
        Display.resetProjectList();

        for (let project of ProjectList.projectList) {
            const projectButton = document.createElement('button');
            projectButton.type = 'button';
            projectButton.textContent = project.title;
            Display.projectButtonsContainer.appendChild(projectButton);
        }
    }

    static resetProjectList() {
        Display.projectButtonsContainer.innerHTML = '';
    }
}

//FORM CONTROLLER
class FormController {
    static formModal = document.querySelector('dialog');
    static submitButton = document.querySelector('.submit-form');
    static selectedItem;
    static selectedProject;
    form = document.querySelector('.task-form');

    constructor() {
        this.exitFormListener();
        this.submitFormListener();
    }

    static resetValues() {
        document.getElementById('title').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('date').value = '';
        document.getElementById('prio').value = 'low';
    }

    static addButtonForm() {
        FormController.formModal.showModal();
        FormController.submitButton.textContent = 'Add Task';
        FormController.resetValues();
    }

    static generateProjectSelection() {
        const projectSelection = document.getElementById('project-selection');
        projectSelection.innerHTML = '';

        for (let project of ProjectList.projectList) {
            const option = document.createElement('option');
            option.value = project.title;
            option.textContent = project.title;

            projectSelection.appendChild(option);
        }
    }

    static setSelectedItem(itemId, parentProject) {
        FormController.selectedProject = ProjectList.projectList.find(({ title }) => (title === parentProject));
        FormController.selectedItem = FormController.selectedProject.todoList.find(({ _id }) => (_id === Number(itemId)));
    }

    static editItemForm(itemId, parentProject) {
        FormController.setSelectedItem(itemId, parentProject);

        FormController.formModal.showModal();

        document.getElementById('title').value = FormController.selectedItem.title;
        document.getElementById('desc').value = FormController.selectedItem.description;
        document.getElementById('date').value = FormController.selectedItem.dueDate;
        document.getElementById('prio').value = FormController.selectedItem.priority;
        document.getElementById('project-selection').value = parentProject;

        FormController.submitButton.textContent = 'Save';
    }

    static deleteItem(itemId, parentProject) {
        FormController.setSelectedItem(itemId, parentProject);
        FormController.selectedProject.removeItem(FormController.selectedItem);
        Display.resetProjectDisplay();
        if (typeof ProjectList.currentProject === 'string') { //Current page is a filter
            FilterController.filterSelector(ProjectList.currentProject);
        }
        else { //Current page is a project
            Display.renderProject(ProjectList.currentProject, false);
        }
    }

    static setCompletedItem(itemId, parentProject, checked) {
        FormController.setSelectedItem(itemId, parentProject);
        FormController.selectedItem.completed = checked;
        console.log(FormController.selectedItem);
    }

    exitFormListener() {
        const exit = document.querySelector('.exit-form');
        exit.addEventListener('click', () => {
            FormController.formModal.close();
        });
    }

    submitFormListener() {
        this.form.addEventListener('submit', (e) => {
            const data = new FormData(e.target);
            const title = data.get('title');
            const desc = data.get('desc');
            const date = data.get('date');
            const prio = data.get('prio');
            const selectedTitle = data.get('project-selection');
            const selectedProject = ProjectList.projectList.find(({ title }) => (title === selectedTitle));

            if (FormController.submitButton.textContent === 'Add Task') { //Adding Task
                const newItem = new TodoItem(title, desc, date, prio, selectedTitle);
                selectedProject.addItem(newItem);
                if (selectedProject != ProjectList.currentProject) {
                    window.alert(`Task was added to ${selectedTitle}`);
                }
            }
            else { //Editing Task
                FormController.selectedItem.title = title;
                FormController.selectedItem.description = desc;
                FormController.selectedItem.dueDate = date;
                FormController.selectedItem.priority = prio;

                const currentTitle = FormController.selectedItem.projectName;
                if (currentTitle != selectedTitle) {
                    selectedProject.addItem(FormController.selectedItem);
                    const previousProject = ProjectList.projectList.find(({ title }) => (title === currentTitle));
                    previousProject.removeItem(FormController.selectedItem);
                }
            }

            Display.resetProjectDisplay();

            if (typeof ProjectList.currentProject === 'string') { //Current page is a filter
                FilterController.filterSelector(ProjectList.currentProject);
            }
            else { //Current page is a project
                ProjectList.currentProject.sortByDate();
                Display.renderProject(ProjectList.currentProject, false);
            }
        });
    }
}

class ProjectListController {
    addProjectForm = document.querySelector('.project-form');
    filterContainer = document.querySelector('.filters');
    projectListContainer = document.querySelector('.project-list');

    constructor() {
        this.addProjectListener();
        this.projectSelectionListener();
        this.filterSelectionListener();
    }

    addProjectListener() {
        this.addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            const title = data.get('project-name');
            this.addProjectForm.reset();

            //Check if project already exists
            for (let project of ProjectList.projectList) {
                if (project.title === title) {
                    window.alert('Project already exists.');
                    return 0;
                }
            }

            const project = new Project(title);
            ProjectList.addProject(project);

            Display.renderProjectList();
        });
    }

    filterSelectionListener() {
        this.filterContainer.addEventListener('click', (e) => {
            if (e.target.type === 'button') { //excludes submit button
                const selectedFilter = e.target.textContent;
                ProjectList.currentProject = selectedFilter;
                FilterController.filterSelector(selectedFilter);
            }
        });
    }

    projectSelectionListener() {
        this.projectListContainer.addEventListener('click', (e) => {
            if (e.target.type === 'button') { //excludes submit button
                const selectedTitle = e.target.textContent;
                ProjectList.currentProject = ProjectList.projectList.find(({ title }) => (title === selectedTitle));

                Display.resetProjectDisplay();
                Display.renderProject(ProjectList.currentProject, false);
            }
        });
    }
}

class FilterController {
    static todayFilter() {
        const today = new Date();
        const todayParsed = FilterController.parseDateString(today);
        const todayFormatted = format(todayParsed, 'MMM dd yyyy');

        const todayProject = new Project('Today');

        for (let project of ProjectList.projectList) {
            for (let item of project.todoList) {
                const itemParsed = FilterController.parseDateString(item.dueDate);
                const itemFormatted = format(itemParsed, 'MMM dd yyyy');

                if (itemFormatted === todayFormatted) {
                    todayProject.addItem(item);
                }
            }
        }

        Display.resetProjectDisplay();
        Display.renderProject(todayProject, false);
    }

    static upcomingFilter() {
        Display.resetProjectDisplay();
        for (let project of ProjectList.projectList) {
            Display.renderProject(project, false);
        }
    }

    static completedFilter() {
        const completedProject = new Project('Completed');

        for (let project of ProjectList.projectList) {
            for( let item of project.todoList) {
                if (item.completed) {
                    completedProject.addItem(item);
                }
            }
        }

        Display.resetProjectDisplay();
        Display.renderProject(completedProject, true);
    }

    static filterSelector(filter) {
        if (filter === 'Upcoming') {
            this.upcomingFilter();
        }
        if (filter === 'Today') {
            this.todayFilter();
        }
        if (filter === 'Completed') {
            this.completedFilter();
        }
    }

    static parseDateString(dateString) {
        const dateOnlyRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])))$/;
        if (dateOnlyRegex.test(dateString)) {
            const utcDate = new Date(dateString)
            const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
            return localDate
        }
        return new Date(dateString)
    }
}


const formController = new FormController();
const projectListController = new ProjectListController();

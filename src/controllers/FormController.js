import ProjectList from '../classes/ProjectList';
import TodoItem from '../classes/TodoItem';
import Display from './Display';
import FilterController from './FilterController';
import localStorageController from './localStorageController';

export default class FormController {
    static formModal = document.querySelector('dialog');
    static submitButton = document.querySelector('.submit-form');
    static selectedItem;
    static selectedProject;
    form = document.querySelector('.task-form');

    constructor() {
        this.exitFormListener();
        this.submitFormListener();
        this.addTaskListener();
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
            
            if(project === ProjectList.currentProject) {
                option.setAttribute('selected', true);
            }

            projectSelection.appendChild(option);
        }
    }

    static setSelectedItem(itemId, parentProject) {
        FormController.selectedProject = ProjectList.projectList.find(({ title }) => (title === parentProject));
        FormController.selectedItem = FormController.selectedProject.todoList.find(({ _id }) => (_id === itemId));
    }

    static editItemForm(itemId, parentProject) {
        FormController.setSelectedItem(itemId, parentProject);
        FormController.generateProjectSelection();
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
        console.log(itemId);
        localStorageController.removeItem(itemId);
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
        localStorageController.addItem(this.selectedItem);
    }

    addTaskListener() {
        const addButton = document.querySelector('.add-task');
        addButton.addEventListener('click', () => {
            FormController.generateProjectSelection();
            FormController.addButtonForm();
        });
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
                const newItem = new TodoItem(title, desc, date, prio, selectedTitle, false);
                selectedProject.addItem(newItem);
                localStorageController.addItem(newItem);
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
                    FormController.selectedItem.projectName = selectedTitle;
                    selectedProject.addItem(FormController.selectedItem);
                    const previousProject = ProjectList.projectList.find(({ title }) => (title === currentTitle));
                    previousProject.removeItem(FormController.selectedItem);
                }
                localStorageController.addItem(FormController.selectedItem);
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
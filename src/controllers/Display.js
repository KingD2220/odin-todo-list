import { format } from "date-fns";
import FormController from './FormController';
import FilterController from './FilterController';
import ProjectList from '../classes/ProjectList';
import editIcon from '../assets/icons/pencil-outline.svg'
import deleteIcon from '../assets/icons/delete-outline.svg'
import projectIcon from '../assets/icons/pound.svg'

export default class Display {

    static projectContainer = document.querySelector('.project-container');
    static projectButtonsContainer = document.querySelector('.project-buttons');

    static renderProject(project, displayChecked) {
        this.displayProjectTitle(project.title);

        //Render todo items
        let skipped = 0;
        for (let item of project.todoList) {
            if (item.completed != displayChecked) { //Skips completed/uncompleted items based on the filter
                skipped++;
                continue;
            }
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.classList.add(`${item.priority}`); //priority
            itemDiv.setAttribute('id', `${item._id}`);

            if (item.completed) {
                itemDiv.classList.add('checked');
            }

            //Left elements
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('item-left')

            const checkWrapper = document.createElement('div');
            checkWrapper.classList.add('checkbox-wrapper-18');

            const roundDiv = document.createElement('div');
            roundDiv.classList.add('round');

            const checkLabel = document.createElement('label');
            checkLabel.setAttribute('for', 'checkbox-18');

            //Checkbox toggle
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.id = 'checkbox-18';
            check.checked = item.completed || false;
            check.addEventListener('change', () => {
                const itemNode = check.parentNode.parentNode.parentNode.parentNode;
                itemNode.classList.toggle('checked');
                FormController.setCompletedItem(itemNode.id, itemNode.querySelector('.parent-project').textContent, check.checked);
                Display.resetProjectDisplay();
                Display.renderProject(project, displayChecked);
            });

            roundDiv.appendChild(check);
            roundDiv.appendChild(checkLabel);
            checkWrapper.appendChild(roundDiv);
            leftDiv.appendChild(checkWrapper);

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

            leftDiv.appendChild(taskInfoDiv);

            //Right elements

            const rightDiv = document.createElement('div');
            rightDiv.classList.add('item-right');

            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add('item-buttons')

            const editButton = document.createElement('button')
            editButton.classList.add('edit');
            editButton.type = 'button';
            editButton.addEventListener('click', (e) => {
                const itemNode = e.target.parentNode.parentNode.parentNode.parentNode;
                FormController.editItemForm(itemNode.id, itemNode.querySelector('.parent-project').textContent);
            });

            const editImg = document.createElement('img');
            editImg.src = editIcon;
            editButton.appendChild(editImg);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.type = 'button';
            deleteButton.addEventListener('click', (e) => {
                const itemNode = e.target.parentNode.parentNode.parentNode.parentNode;
                FormController.deleteItem(itemNode.id, itemNode.querySelector('.parent-project').textContent);
            });

            const deleteImg = document.createElement('img');
            deleteImg.src = deleteIcon;
            deleteButton.appendChild(deleteImg);

            const projectName = document.createElement('p');
            projectName.classList.add('parent-project');
            projectName.textContent = item.projectName;

            buttonDiv.appendChild(editButton);
            buttonDiv.appendChild(deleteButton);
            rightDiv.appendChild(buttonDiv);
            rightDiv.appendChild(projectName);

            itemDiv.appendChild(leftDiv);
            itemDiv.appendChild(rightDiv);

            Display.projectContainer.appendChild(itemDiv);
        }

        if (project.todoList.length === skipped) {
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = "If you have completed all your tasks, great job! Otherwise, go ahead and add a task."
            if (project.title === 'Completed') {
                emptyMessage.textContent = 'This is empty. Go complete some tasks!'
            }
            Display.projectContainer.appendChild(emptyMessage);
        }
    }

    static resetProjectDisplay() {
        Display.projectContainer.innerHTML = '';
    }

    static renderProjectList() {
        Display.resetProjectList();

        for (let project of ProjectList.projectList) {
            const projectButton = document.createElement('button');
            projectButton.type = 'button';
            projectButton.classList.add('project-button');

            const projectImg = document.createElement('img');
            projectImg.src = projectIcon;
            projectButton.appendChild(projectImg);

            const projectText = document.createElement('span');
            projectText.textContent = project.title;
            projectButton.appendChild(projectText);

            const deleteImg = document.createElement('img');
            deleteImg.src = deleteIcon;
            deleteImg.classList.add('delete-project');
            projectButton.appendChild(deleteImg);

            Display.projectButtonsContainer.appendChild(projectButton);
        }
    }

    static resetProjectList() {
        Display.projectButtonsContainer.innerHTML = '';
    }

    static displayProjectTitle(header) {
        const title = document.createElement('h1');
        title.classList.add('project-title');
        title.textContent = header;
        Display.projectContainer.appendChild(title);
    }
}
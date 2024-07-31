import './styles.css';
import ProjectList from './classes/ProjectList';
import Project from './classes/Project';
import TodoItem from './classes/TodoItem';
import FormController from './controllers/FormController';
import ProjectListController from './controllers/ProjectListController';
import Display from './controllers/Display';
import localStorageController from './controllers/localStorageController';
import { validate as uuidValidate} from 'uuid';

//INITIALIZATION
const formController = new FormController();
const projectListController = new ProjectListController();

//Initialize projects from local storage
if (localStorageController.retrieveProjectListStorage()) { //Retrieve project list from local storage
    const projectNames = JSON.parse(localStorage.getItem('projectNamesArray'));

    for (let title of projectNames) {
        const project = new Project(title);
        ProjectList.addProject(project);
    }
}
else { //Initialize project list with default project
    const project = new Project('My Project');
    ProjectList.addProject(project);
    localStorageController.addProject(project.title);
    localStorageController.retrieveProjectListStorage();
}

ProjectList.currentProject = ProjectList.projectList[0];
Display.renderProjectList();

//Initialize todo items from local storage
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (uuidValidate(key)) { //checks for todo item
        const itemParsed = JSON.parse(localStorage.getItem(key));
        const todoItem = new TodoItem(itemParsed.title, itemParsed.description, itemParsed.dueDate, itemParsed.priority, itemParsed.projectName, itemParsed.completed, itemParsed._id);
        const project = ProjectList.projectList.find(({ title }) => (title === todoItem.projectName));
        project.addItem(todoItem);
    }
}

Display.renderProject(ProjectList.currentProject, false);

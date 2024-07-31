import ProjectList from '../classes/ProjectList';
import Project from '../classes/Project';
import Display from './Display';
import FilterController from './FilterController';
import localStorageController from './localStorageController';

export default class ProjectListController {
    addProjectForm = document.querySelector('.project-form');
    filterContainer = document.querySelector('.filters');
    projectListContainer = document.querySelector('.project-buttons');

    constructor() {
        this.addProjectListener();
        this.projectClickListener();
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
            localStorageController.addProject(title);

            Display.renderProjectList();
        });
    }

    filterSelectionListener() {
        this.filterContainer.addEventListener('click', (e) => {
            const selectedFilter = e.target.className;
            ProjectList.currentProject = selectedFilter;
            FilterController.filterSelector(selectedFilter);
        });
    }

    projectClickListener() {
        this.projectListContainer.addEventListener('click', (e) => {
            if (e.target.className === 'delete-project') { //delete selected project
                const selectedTitle = e.target.parentNode.textContent;
                let confirmation = confirm(`Are you sure you want to delete ${selectedTitle}? \n(This also deletes all tasks within and cannot be undone.)`)
                if (confirmation){
                    const selectedProject = ProjectList.projectList.find(({ title }) => (title === selectedTitle));
                    localStorageController.removeProjectItems(selectedProject);
                    ProjectList.removeProject(selectedProject);
                    localStorageController.removeProject(selectedTitle);

                    Display.renderProjectList();
                    if (selectedTitle === ProjectList.currentProject.title) {
                        Display.resetProjectDisplay();
                    }
                }
            }
            else if (e.target.textContent) {
                const selectedTitle = e.target.textContent;
                ProjectList.currentProject = ProjectList.projectList.find(({ title }) => (title === selectedTitle));
                Display.resetProjectDisplay();
                Display.renderProject(ProjectList.currentProject, false);
            }
        });
    }
}
export default class ProjectList {
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

    static removeProject(project) {
        this.projectList.splice(this.projectList.indexOf(project), 1);
    }

    static get projectList() {
        return ProjectList.projectList;
    }
}
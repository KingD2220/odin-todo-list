export default class localStorageController {
    static projectNamesArray = [];

    //Setting Storage
    static addItem(item) {
        localStorage.setItem(item._id, JSON.stringify(item));
    }

    static removeItem(itemId) {
        localStorage.removeItem(itemId);
    }

    static addProject(projectName) {
        this.projectNamesArray.push(projectName);
        this.updateProjectStorage();
    }

    static removeProject(projectName) {
        this.projectNamesArray.splice(this.projectNamesArray.indexOf(projectName), 1);
        this.updateProjectStorage();
    }

    static updateProjectStorage() {
        localStorage.setItem('projectNamesArray', JSON.stringify(this.projectNamesArray));
    }

    static retrieveProjectListStorage() {
        const list = localStorage.getItem('projectNamesArray');
        if (list) {
            this.projectNamesArray = JSON.parse(list);
            return true;
        }
        else {
            return false;
        }

    }

    static removeProjectItems(project) {
        for (let item of project.todoList) {
            this.removeItem(item._id);
        }
    }

}
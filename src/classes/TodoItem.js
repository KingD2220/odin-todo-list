import { v4 as uuidv4 } from 'uuid';

export default class TodoItem {
    constructor(title, description, dueDate, priority, projectName, completed, id = uuidv4()) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.projectName = projectName;

        this._id = id;
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId++;
        return this.latestId;
    }
}
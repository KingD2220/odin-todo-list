import { compareAsc } from "date-fns";

export default class Project {
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
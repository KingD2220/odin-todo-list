import { format } from "date-fns";
import Project from '../classes/Project';
import ProjectList from '../classes/ProjectList';
import Display from './Display';

export default class FilterController {
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
        Display.displayProjectTitle('Upcoming');
        
        for (let project of ProjectList.projectList) {
            Display.renderProject(project, false);
        }
    }

    static completedFilter() {
        const completedProject = new Project('Completed');

        for (let project of ProjectList.projectList) {
            for (let item of project.todoList) {
                if (item.completed) {
                    completedProject.addItem(item);
                }
            }
        }

        Display.resetProjectDisplay();
        Display.renderProject(completedProject, true);
    }

    static filterSelector(filter) {
        if (filter === 'upcoming') {
            this.upcomingFilter();
        }
        if (filter === 'today') {
            this.todayFilter();
        }
        if (filter === 'completed') {
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
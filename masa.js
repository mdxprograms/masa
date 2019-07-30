const root = document.getElementById("app");

const initialState = {
  tasks: [],
  task: {
    id: 0,
    title: "",
    description: "",
    projects: ""
  }
};

let TaskModel = Object.create(initialState.task);

let TasksModel = {
  tasks: Object.create(initialState.tasks),
  getTask(id) {
    return TasksModel.tasks.find(t => t.id === id);
  },
  delete(id) {
    TasksModel.tasks = TasksModel.tasks.filter(t => t.id !== id);
  },
  save(task) {
    const idx = TasksModel.tasks.findIndex(t => t.id === task.id);

    if (TasksModel.getTask(task.id)) {
      _.chain(TasksModel.tasks)
        .find({ id: task.id })
        .merge(task);
    } else {
      task.id = TasksModel.tasks.length + 1;
      TasksModel.tasks.push(task);
    }

    TaskModel = Object.create(initialState.task);
  }
};

const Task = {
  handleEdit(id) {
    TaskModel = TasksModel.getTask(id);
    document.querySelector(".task-form .title").focus();
  },
  view(vnode) {
    const { id, title, description, projects } = vnode.attrs;

    return m(".task", { key: id }, [
      m(".title", title),
      m(".description", description),
      m(".projects", projects),
      m("button.edit", { onclick: () => Task.handleEdit(id) }, "Edit"),
      m("button.delete", { onclick: () => TasksModel.delete(id) }, "Delete")
    ]);
  }
};

const TaskForm = {
  updateTitle: e => {
    TaskModel.title = e.target.value;
  },
  updateDescription: e => {
    TaskModel.description = e.target.value;
  },
  updateProjects: e => {
    TaskModel.projects = e.target.value;
  },
  view: () =>
    m(".task-form", [
      m("input[type=text].title", {
        oninput: TaskForm.updateTitle,
        placeholder: "Enter Title",
        value: TaskModel.title
      }),
      m(
        "textarea.description",
        {
          onchange: TaskForm.updateDescription,
          placeholder: "Description"
        },
        TaskModel.description
      ),
      m("input[type=text].projects", {
        oninput: TaskForm.updateProjects,
        placeholder: "Projects",
        value: TaskModel.projects
      }),
      m(
        "button.submit",
        { onclick: () => TasksModel.save(TaskModel) },
        "Save Task"
      )
    ])
};

const TaskList = {
  view(vnode) {
    const { tasks } = vnode.attrs;
    return m(".task-list", tasks.map(t => m(Task, t)));
  }
};

const app = {
  view() {
    return m(".wrap", [m(TaskForm), m(TaskList, { tasks: TasksModel.tasks })]);
  }
};

m.mount(root, app);

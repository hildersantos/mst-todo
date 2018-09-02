import React from "react";
import { render } from "react-dom";
import { types } from "mobx-state-tree";
import { observer } from "mobx-react";
import { values } from "mobx";

let id = 1;
const randomId = () => ++id;

// Criando os modelos
const Todo = types
  .model({
    id: types.identifierNumber,
    name: types.optional(types.string, ""), // default values
    done: types.optional(types.boolean, false)
  })
  .actions(self => {
    function setName(newName) {
      self.name = newName;
    }
    function toggle() {
      self.done = !self.done;
    }
    return { setName, toggle };
  });

const User = types.model({
  name: types.optional(types.string, "")
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {})
  })
  .views(self => ({
    get pendingCount() {
      return values(self.todos).filter(todo => !todo.done).length;
    },
    get completedCount() {
      return values(self.todos).filter(todo => todo.done).length;
    }
  }))
  .actions(self => {
    function addTodo(id, name) {
      self.todos.set(id, Todo.create({ name, id }));
    }

    return { addTodo };
  });

const store = RootStore.create({
  users: {}, // Users não está marcado como opcional. Interessante!
  todos: {
    1: {
      id: id,
      name: "Eat a cake",
      done: true
    }
  }
});

const TodoView = observer(props => {
  return (
    <div>
      <input
        type="checkbox"
        checked={props.todo.done}
        onChange={e => props.todo.toggle()}
      />
      <input
        type="text"
        value={props.todo.name}
        onChange={e => props.todo.setName(e.currentTarget.value)}
      />
    </div>
  );
});

const TodoViewCounter = observer(props => (
  <div>
    {props.store.pendingCount} pending, {props.store.completedCount} completed
  </div>
));

const AppView = observer(props => {
  return (
    <div>
      <button onClick={e => props.store.addTodo(randomId(), "New Task")}>
        Add Task
      </button>
      {values(props.store.todos).map(todo => (
        <TodoView key={todo.id} todo={todo} />
      ))}
      <TodoViewCounter store={props.store} />
    </div>
  );
});

render(<AppView store={store} />, document.getElementById("root"));

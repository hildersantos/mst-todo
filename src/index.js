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
  .actions(self => {
    function addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    }

    return { addTodo };
  });

const store = RootStore.create({
  users: {}, // Users não está marcado como opcional. Interessante!
  todos: {
    "1": {
      id: id,
      name: "Eat a cake",
      done: true
    }
  }
});

const App = observer(props => (
  <div>
    <button onClick={e => props.store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {values(props.store.todos).map(todo => (
      <div key={todo.id}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={e => todo.toggle()}
        />
        <input
          type="text"
          value={todo.name}
          onChange={e => todo.setName(e.currentTarget.value)}
        />
      </div>
    ))}
  </div>
));

render(<App store={store} />, document.getElementById("root"));

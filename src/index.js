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
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User)))
  })
  .actions(self => {
    function setName(newName) {
      self.name = newName;
    }
    function setUser(user) {
      if (user === "") {
        // When selected is empty
        self.user = null;
      } else {
        self.user = user;
      }
    }
    function toggle() {
      self.done = !self.done;
    }
    return { setName, setUser, toggle };
  });

const User = types.model({
  id: types.identifierNumber,
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
    },
    getTodosWhereDoneIs(done) {
      return values(self.todos).filter(todo => todo.done === done);
    }
  }))
  .actions(self => {
    function addTodo(id, name) {
      self.todos.set(id, Todo.create({ name, id }));
    }

    return { addTodo };
  });

const store = RootStore.create({
  users: {
    1: {
      id: 1,
      name: "mweststrate"
    },
    2: {
      id: 2,
      name: "mattiamanzati"
    },
    3: {
      id: 3,
      name: "johndoe"
    }
  },
  todos: {
    1: {
      id: 1,
      name: "Eat a cake",
      done: true
    }
  }
});

const UserPickView = observer(props => (
  <select
    value={props.user ? props.user.id : ""}
    onChange={e => props.onChange(e.currentTarget.value)}
  >
    <option value="">--none--</option>
    {values(props.store.users).map(user => (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    ))}
  </select>
));

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
      <UserPickView
        user={props.todo.user}
        store={props.store}
        onChange={userId => props.todo.setUser(userId)}
      />
    </div>
  );
});

const TodoCounterView = observer(props => (
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
        <TodoView key={todo.id} store={props.store} todo={todo} />
      ))}
      <TodoCounterView store={props.store} />
      <h4>Completadas</h4>
      {props.store.getTodosWhereDoneIs(true).map(todo => (
        <TodoView key={todo.id} store={props.store} todo={todo} />
      ))}
    </div>
  );
});

render(<AppView store={store} />, document.getElementById("root"));

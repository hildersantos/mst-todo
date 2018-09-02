import { types, getSnapshot } from "mobx-state-tree";

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
  users: {} // Users não está marcado como opcional. Interessante!
});

// Crio as instâncias com os valores padrão.
const john = User.create();
const eat = Todo.create();

// Sobrescrevendo os valores padrão
const sleep = Todo.create({ name: "Sleep" });

store.addTodo(1, "Eat a cake"); // Crio um Todo, usando o map
store.todos.get(1).toggle(); // Toggle TODO da store

console.log("John:", john.toJSON());
console.log("Eat TODO:", eat.toJSON());
console.log("Sleep TODO:", sleep.toJSON());
console.log(getSnapshot(store));

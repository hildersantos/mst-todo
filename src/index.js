import { types } from "mobx-state-tree";

// Criando os modelos
const Todo = types.model({
  name: types.optional(types.string, ""), // default values
  done: types.optional(types.boolean, false)
});

const User = types.model({
  name: types.optional(types.string, "")
});

const RootStore = types.model({
  users: types.map(User),
  todos: types.optional(types.map(Todo), {})
});

const store = RootStore.create({
  users: {} // Users não está marcado como opcional. Interessante!
});

// Crio as instâncias com os valores padrão.
const john = User.create();
const eat = Todo.create();

// Sobrescrevendo os valores padrão
const sleep = Todo.create({ name: "Sleep" });

console.log("John:", john.toJSON());
console.log("Eat TODO:", eat.toJSON());
console.log("Sleep TODO:", sleep.toJSON());

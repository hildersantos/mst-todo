import { types } from "mobx-state-tree";

const Todo = types.model({
  name: "", // default values
  done: false
});

const User = types.model({
  name: ""
});

// Crio as instâncias com os valores padrão.
const john = User.create();
const eat = Todo.create();

console.log("John:", john.toJSON());
console.log("Eat TODO:", eat.toJSON());

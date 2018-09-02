import { types } from "mobx-state-tree";

const Todo = types.model({
  name: "", // default values
  done: false
});

const User = types.model({
  name: ""
});

import { writable } from "svelte/store";

const allUsers = writable({
  users: null,
});

export default allUsers;

import { writable } from "svelte/store";

const userState = writable({
  user: null,
});

export default userState;

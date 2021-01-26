import { writable } from "svelte/store";

const allFriends = writable({
  allFriends: null,
});

export default allFriends;

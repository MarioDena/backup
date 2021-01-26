import { writable } from "svelte/store";

const allChats = writable({
  allchats: null,
});

export default allChats;

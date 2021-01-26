import { writable } from "svelte/store";

const UIState = writable({
  loading: true,
  loadingData: false,
  errors: {},
});

export default UIState;

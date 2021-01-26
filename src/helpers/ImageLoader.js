import UIState from "../stores/UI.js";

const loadImages = async (data) => {
  const promises = await Object.keys(data).map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.src = data[src];
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  await Promise.all(promises);
  UIState.update((state) => {
    return { ...state, loading: false };
  });
};

export default loadImages;

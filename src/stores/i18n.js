import { derived, writable } from "svelte/store";

export const dict = writable();

export const locale = writable("En");

const localizedDict = derived([dict, locale], ([$dict, $locale]) => {
  if (!$dict || !$locale) return;
  return $dict[$locale];
});

const getMessageFromLocalizedDict = (id, localizedDict) => {
  const splitID = id.split(".");
  let message = { ...localizedDict };
  splitID.forEach((partialid) => {
    message = message[partialid];
  });

  return message;
};

const createMessageFormatter = (localizedDict) => (id) => getMessageFromLocalizedDict(id, localizedDict);

export const t = derived(localizedDict, ($localizedDict) => {
  return createMessageFormatter($localizedDict);
});

import { writable } from "svelte/store";

const applicationData = writable({
  nickname: null,
  phone: null,
  country: null,
  citizenship: null,
  dateofbirth: null,
  mailingAdress: null,
  sex: null,
  howYouLearnAboutus: null,
  interest: null,
  beentoColombia: null,
  planToColombia: null,
});

export default applicationData;

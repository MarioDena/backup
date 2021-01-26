import axios from "axios";
import userState from "../stores/User";
import UIState from "../stores/UI";
import jwtDecode from "jwt-decode";
import allUsers from "../stores/AllUsers";
import allFriends from "../stores/allFriends";
import allChats from "../stores/allChats";
//import loadImages from "./loadImages";

export const sendMessageFromInbox = (message, sender, short, id, userList) => {
  const messageLong = { newMessage: message, sender, short, id };
  axios.post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/sendmessage", messageLong).then((res) => {
    getallFriendsforInbox(sender, userList);
  });
};

export const getAlluserFriendships = async (user, userList) => {
  const mailtoCheck = { user };
  axios.post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/getallfriends", mailtoCheck).then((res) => {
    const allUsersAndStatus = res.data;

    const allemails = [];

    Object.keys(res.data).forEach((val) => {
      if (!allemails.includes(res.data[val].friends.creator) || !allemails.includes(res.data[val].friends.friend)) {
        allemails.push(res.data[val].friends.creator);
        allemails.push(res.data[val].friends.friend);
      }
    });
    userList.forEach((obj) => {
      if (!allemails.includes(obj.email)) {
        allUsersAndStatus.push({
          ...obj,
          dummydata: true,
          friends: { creator: obj.email, friend: obj.email },
        });
      }
    });
    allFriends.update((state) => {
      return { allFriends: allUsersAndStatus };
    });
    UIState.update((state) => {
      return { ...state, errors: {}, loadingData: false };
    });
  });
};

export const getallFriendsforInbox = (user, userList) => {
  UIState.update((state) => {
    return { ...state, errors: {}, loadingData: true };
  });
  console.log(userList);
  const mailtoCheck = { user };
  axios.post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/getallfriends", mailtoCheck).then((res) => {
    const finalData = [];

    Object.keys(res.data).forEach((val) => {
      userList.forEach((obj) => {
        if (obj.email !== user) {
          if (res.data[val].friends.creator === obj.email || res.data[val].friends.friend === obj.email) {
            if (res.data[val].confirmed === true) {
              finalData.push({
                ...res.data[val],
                ...obj,
                shortname: `${obj.name[0]} ${obj.lastname[0]}`,
              });
            }
          }
        }
      });
    });
    console.log(finalData);
    allChats.update((state) => {
      return { allchats: finalData };
    });
    UIState.update((state) => {
      return { ...state, errors: {}, loadingData: false };
    });
  });
};

export const confirmFriendship = (id, mail, userList) => {
  const mailtoCheck = { user: mail };
  UIState.update((state) => {
    return { ...state, errors: {}, loadingData: true };
  });
  axios.post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/confirmfriend", { id }).then((res) => {
    getAlluserFriendships(mail, userList);
  });
};

export const createFriendship = async (creator, friend, userList) => {
  const UsersTosend = userList;
  const friendship = { creator, friend };
  UIState.update((state) => {
    return { ...state, errors: {}, loadingData: true };
  });
  axios.post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/createfriendship", friendship).then((res) => {
    getAlluserFriendships(creator, UsersTosend);
  });
};

export const checkLocalUserPublic = async (token) => {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 100 > Date.now()) {
    logoutUserPublic();
  } else {
    setAuthorizationHeader(token);
    getUserData();
  }
};

export const getallUsers = async () => {
  axios.get("https://us-central1-epioneers-f9072.cloudfunctions.net/api/allusers").then((res) => {
    allUsers.update((state) => {
      return { users: res.data };
    });
  });
};

export const checkLocalUserPrivate = async (token) => {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 100 > Date.now()) {
    logoutUsePrivate();
  } else {
    setAuthorizationHeader(token);
    getUserData();
  }
};

export const logoutUserPublic = async () => {
  localStorage.removeItem("FBtoken");
  delete axios.defaults.headers.common["Authorization"];
  userState.update((state) => {
    return { ...state, user: null };
  });
  UIState.update((state) => {
    return { ...state, errors: {}, loading: false };
  });
};

export const checkLocalToken = async (isPublic, images) => {
  const token = localStorage.FBtoken;
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 100 > Date.now()) {
      if (isPublic) {
        logoutUser();
        //loadImages(images);
      } else {
        logoutUser();
        window.location.href = "/";
      }
    } else {
      setAuthorizationHeader(token);
      getUserData(true);
      if (isPublic === false) {
        //loadImages(images);
      }
    }
  } else {
    if (isPublic === false) {
      window.location.href = "/";
    }
  }
};

export const signupUser = (userData) => {
  UIState.update((state) => {
    return { ...state, loadingData: true };
  });
  axios
    .post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/signup", userData)
    .then((res) => {
      setAuthorizationHeader(`Bearer ${res.data.token}`);
      getUserData();
    })
    .catch((err) => {
      UIState.update((state) => {
        return { ...state, errors: err.response.data, loadingData: false };
      });
    });
};

export const loginUser = async (userData) => {
  UIState.update((state) => {
    return { ...state, loadingData: true };
  });
  axios
    .post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/login", userData)
    .then((res) => {
      setAuthorizationHeader(`Bearer ${res.data.token}`);
      getUserData();
    })
    .catch((err) => {
      UIState.update((state) => {
        return { ...state, errors: err.response.data, loadingData: false };
      });
    });
};

export const getUserData = async (firstLoad) => {
  axios
    .get("https://us-central1-epioneers-f9072.cloudfunctions.net/api/usersinfo")
    .then((res) => {
      UIState.update((state) => {
        return { ...state, loadingData: false, errors: {} };
      });
      userState.update(() => {
        return { user: res.data };
      });
    })
    .catch(() => {
      logoutUser();
      if (firstLoad) {
        window.location.href = "/";
      }
    });
};

export const logoutUser = async () => {
  localStorage.removeItem("FBtoken");
  delete axios.defaults.headers.common["Authorization"];
  userState.update((state) => {
    return { ...state, user: null };
  });
  UIState.update((state) => {
    return { ...state, errors: {} };
  });
  window.location.href = "/";
};

export const logoutUserPrivate = async () => {
  localStorage.removeItem("FBtoken");
  delete axios.defaults.headers.common["Authorization"];
  userState.update((state) => {
    return { ...state, user: null };
  });
  UIState.update((state) => {
    return { ...state, errors: {} };
  });
  window.location.href = "/Login";
};

export const finishApplication = (dataUpdate) => {
  UIState.update((state) => {
    return { ...state, loadingData: true };
  });
  axios
    .post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/userupdate", dataUpdate)
    .then(() => {
      getUserData();
    })
    .catch((err) => {
      logoutUser();
    });
};

export const userUpdateGenreal = async (dataUpdate) => {
  UIState.update((state) => {
    return { ...state, loadingData: true };
  });
  axios
    .post("https://us-central1-epioneers-f9072.cloudfunctions.net/api/userupdate", dataUpdate)
    .then(() => {
      getUserData();
    })
    .catch((err) => {
      logoutUser();
    });
};

const setAuthorizationHeader = (token) => {
  const FBtoken = token;
  localStorage.setItem("FBtoken", FBtoken);
  axios.defaults.headers.common["Authorization"] = FBtoken;
};

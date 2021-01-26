<script>
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";

  import { Avatar, ProgressLinear, Row, Col, Textarea, Button, TextField, ProgressCircular } from "svelte-materialify";
  import { Container } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { checkLocalUserPrivate, getallFriendsforInbox, getallUsers, logoutUser, sendMessageFromInbox } from "../helpers/authActions";
  import UIState from "../stores/UI";
  import userState from "../stores/User";
  import NavLink from "../components/NavLink.svelte";
  import allChats from "../stores/allChats";
  import allUsers from "../stores/AllUsers";

  const token = localStorage.FBtoken;
  let localUser = null;
  let localUsers = null;
  let localchats = null;
  let localUserShort = "";
  let messages = null;
  let localUserShoten = "";
  let bodyMessage = "";
  let selectedConversation = null;
  let objDiv;
  let hour = new Date().toLocaleString();

  const unsubState2 = allChats.subscribe((state) => {
    if (state.allchats !== null) {
      localchats = state.allchats;
    }
  });

  const unsubState3 = allUsers.subscribe((state) => {
    if (state.users !== null) {
      localUsers = state.users;
      setTimeout(() => {
        getallFriendsforInbox(localUser.credentials.email, localUsers);
      }, 1000);
    }
  });

  const unsubState = userState.subscribe((state) => {
    if (state.user !== null) {
      localUser = state.user;
      getallUsers();
      const localUserLongName = [state.user.credentials.name || "", state.user.credentials.lastname || ""];
      localUserShoten = `${state.user.credentials.name} ${state.user.credentials.lastname[0]}.`;
      localUserShort = localUserLongName.map((str) => str[0]).join("");
    }
  });

  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
      event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
    }
  }

  onMount(() => {
    setTimeout(() => {
      objDiv = document.getElementById("messagesContainer");
      document.getElementById("usermsg").addEventListener("keypress", submitOnEnter);
    }, 1000);

    UIState.update((state) => {
      return { ...state, errors: {}, loading: true };
    });
    if (localUser === null) {
      if (token) {
        checkLocalUserPrivate(token);
      } else {
        logoutUser();
      }
    } else {
      if (localUser.credentials.applied === false || localUser.credentials.aplicationsSucceded === false) {
        navigate("/Application");
      } else {
        UIState.update((state) => {
          return { ...state, errors: {}, loading: false };
        });
      }
    }
  });

  const navigateToInbox = () => {
    navigate("/Inbox");
  };

  const navigateToProfile = () => {
    navigate("/Profile");
  };

  const logout = () => {
    logoutUser();
  };

  const sendMessage = (e, sender, body, short, id) => {
    e.preventDefault();
    bodyMessage = "";
    sendMessageFromInbox(body, sender, short, id, localUsers);
  };

  const setSelectedConversation = (id) => {
    selectedConversation = id;
    localchats.forEach((element) => {
      if (element.id === id) {
        messages = element.messages;
      }
    });
    setTimeout(() => {
      objDiv = document.getElementById("messagesContainer");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 1000);
  };

  afterUpdate(() => {
    if (selectedConversation !== null) {
      localchats.forEach((element) => {
        if (element.id === selectedConversation) {
          messages = element.messages;
        }
      });
      setTimeout(() => {
        objDiv = document.getElementById("messagesContainer");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 1000);
    }
  });

  onDestroy(() => {
    unsubState();
    unsubState2();
    unsubState3();
    console.log(allChats, allUsers);
  });
</script>

{#if $UIState.loading === true}
  <ProgressLinear indeterminate={true} />
{:else}
  <div>
    <div class="menu">
      <NavLink to={`/Dashboard`}><p class="link">DashBoard <img class="ArrowMenu" src={generalAssets.arrowMenu} alt="" /></p></NavLink>
      <NavLink to={`/Community`}><p class="link">Community<img class="ArrowMenu" src={generalAssets.arrowMenu} alt="" /></p></NavLink>
      <NavLink to={`/Travels`}><p class="link">My Travels<img class="ArrowMenu" src={generalAssets.arrowMenu} alt="" /></p></NavLink>
      <NavLink to={`/Inbox`}><p class="link">My Inbox<img class="ArrowMenu" src={generalAssets.arrowMenu} alt="" /></p></NavLink>
    </div>
    <div class="mainContent">
      <Container>
        <Row style="align-items: center; margin-top: 50px">
          <img class="interactableButton" style="margin-right: 20px; margin-left:auto" src={generalAssets.inviteButton} alt="" />
          <img class="interactableButton" on:click={navigateToInbox} style="margin-right: 20px;" src={generalAssets.messagesEmpty} alt="" />
          <img class="interactableButton" on:click={logout} style="margin-right: 20px;" src={generalAssets.logoutButton} alt="" />
        </Row>
        <Row>
          <Col>
            <h4 in:fade class="font title">Inbox</h4>
            <p in:fade class="font subTitle">Stay connected with our community</p>
          </Col>
        </Row>
        <Row>
          <Col cols="5">
            <p in:fade class="fontBold subTitle">Friends</p>
            <div style="height: 30vh; overflow: scroll; overflow-x: hidden; padding: 10px">
              {#if localchats !== null}
                {#if localchats.length > 0}
                  {#each localchats as chats}
                    <div
                      in:fade
                      on:click={() => {
                        setSelectedConversation(chats.id);
                      }}
                      class="newsContainer"
                    >
                      <div
                        style="position: absolute; top:0; left: 0; width:100%; height:100%; background-image: linear-gradient(135deg, #3023ae 0%, #c86dd7 100%);
                    opacity: 0.15;"
                      />
                      <Avatar class="indigo" style="font-family: AvenirBold; margin-right: 40px">
                        {chats.shortname}
                      </Avatar>
                      <p style="font-family: Poppins; font-size: 18px; margin-top: 10px">
                        {`${chats.name} ${chats.lastname}`}
                      </p>
                    </div>
                  {/each}
                {:else}
                  <div in:fade class="newsContainer">
                    <div
                      style="position: absolute; top:0; left: 0; width:100%; height:100%; background-image: linear-gradient(135deg, #3023ae 0%, #c86dd7 100%);
                    opacity: 0.15;"
                    />

                    <p style="font-family: Poppins; font-size: 18px; margin-top: 10px">You haven't added any friends</p>
                  </div>
                {/if}
              {/if}
            </div>
          </Col>
          <Col cols="7">
            <img
              style="width:100%; height: 20px; padding-left: 20%; padding-right: 20%; margin-right: 20px"
              src={generalAssets.conversationHead}
              alt=""
            />
            <div id="messagesContainer" style="height: 30vh; overflow: scroll; overflow-x: hidden; padding: 10px">
              {#if messages !== null}
                {#if messages.length > 0}
                  {#each messages as msg}
                    {#if msg.sender === localUser.credentials.email}
                      <div class="exitMessage">
                        <div style="margin: 10px">
                          <Avatar class="indigo" style="font-family: AvenirBold">
                            {msg.senderShort}
                          </Avatar>
                        </div>
                        <div style="width: 85%">
                          <p class="font" style="white-space: pre-wrap; float: right; width: 100%; font-size: 14px; overflow-x: hidden">
                            {msg.body}
                          </p>
                        </div>
                      </div>
                    {:else}
                      <div class="entryMessage">
                        <div style="margin: 10px">
                          <Avatar class="indigo" style="font-family: AvenirBold">
                            {msg.senderShort}
                          </Avatar>
                        </div>

                        <div style="width: 85%">
                          <p class="font" style="white-space: pre-wrap; width: 100%; font-size: 14px;  overflow-x: hidden">
                            {msg.body}
                          </p>
                        </div>
                      </div>
                    {/if}
                  {/each}
                {:else}
                  <div class="entryMessage">
                    <div style="margin: 10px">
                      <Avatar class="indigo" style="font-family: AvenirBold">EP</Avatar>
                    </div>

                    <div style="width: 85%">
                      <p class="font" style="width: 100%; font-size: 14px;  overflow-x: hidden">
                        You just became friends! Start a conversation!
                      </p>
                    </div>
                  </div>
                {/if}
              {/if}
            </div>
            <form
              style="display: flex; padding: 50px; align-items: center"
              on:submit={(e) => {
                sendMessage(e, localUser.credentials.email, bodyMessage, localUserShort, selectedConversation);
              }}
            >
              <Textarea
                disabled={selectedConversation === null ? true : false}
                rows="2"
                id="usermsg"
                bind:value={bodyMessage}
                style="margin-right: 30px"
                filled
              />
              {#if $UIState.loadingData !== true && messages !== null}
                <Button
                  type="submit"
                  on:click={(e) => {
                    sendMessage(e, localUser.credentials.email, bodyMessage, localUserShort, selectedConversation);
                  }}
                  class="yellow whitetext"
                >Send</Button
                >
              {:else}
                <Button type="submit" class="grey whitetext">Send</Button>
              {/if}
            </form>
          </Col>
        </Row>
      </Container>
    </div>
    <div on:click={navigateToProfile} class="userMenu">
      <Avatar class="indigo" style="font-family: AvenirBold; margin-right: 40px">
        {localUserShort}
      </Avatar>
      <p style="font-family: Poppins; font-size: 18px; margin-top: 10px">
        {`${localUser.credentials.name} ${localUser.credentials.lastname}`}
      </p>
    </div>
    <img class="background" src={generalAssets.background} alt="" />
    <img class="mainLogo" src={generalAssets.dashboardLogo} alt="" />
  </div>
{/if}

<style>
  .entryMessage {
    margin: 10px;
    display: flex;
    width: 70%;
    padding: 10px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.411);
  }

  .exitMessage {
    margin: 10px;
    float: right;
    display: flex;
    flex-direction: row-reverse;
    width: 70%;
    padding: 10px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.137);
  }
  .newsContainer {
    cursor: pointer;
    position: relative;
    padding: 10px;
    display: flex;
    border-radius: 25px;
    width: calc(100% - 80px);
    height: 71px;
    margin-left: 80px;
    margin-bottom: 20px;
  }
  .subTitle {
    margin-left: 80px;
    font-size: 21px;
    color: white;
  }
  .title {
    font-size: 40px;
    margin-top: 80px;
    margin-left: 80px;
    color: white;
  }
  .interactableButton {
    cursor: pointer;
  }
  .mainContent {
    padding-left: 100px;
    z-index: 900;
    position: absolute;
    width: calc(100vw - 237px);
    height: 100vh;
    right: 0px;
    top: 0px;
    overflow: scroll;
    overflow-x: hidden;
  }
  .userMenu {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 900;
    position: absolute;
    left: 0;
    bottom: 30px;
    height: 78px;
    min-width: 300px;
    border-radius: 0 19px 19px 0;
    -webkit-box-shadow: 2px 3px 5px 1px rgba(230, 230, 230, 1);
    -moz-box-shadow: 2px 3px 5px 1px rgba(230, 230, 230, 1);
    box-shadow: 2px 3px 5px 1px rgba(230, 230, 230, 1);
    background-color: white;
  }
  .mainLogo {
    position: absolute;
    top: 50px;
    left: 50px;
  }
  .ArrowMenu {
    margin-top: 5px;
    float: right;
  }
  .link {
    margin-top: 10px;
    border-bottom: 1px solid lightgray;
    margin-left: 20px;
    font-style: normal;
    font-size: 19px;
    font-family: "Poppins";
    font-weight: 400;
  }
  .menu {
    position: relative;
    z-index: 900;
    width: 237px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .background {
    z-index: 0;
    position: absolute;
    width: calc(100vw - 237px);
    height: 100vh;
    right: 0px;
    top: 0px;
  }
</style>

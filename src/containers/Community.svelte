<script>
  import { fade } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";

  import { Avatar, ProgressLinear, Row, Col, Select, Button } from "svelte-materialify";
  import { Container } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import {
    checkLocalUserPrivate,
    confirmFriendship,
    createFriendship,
    getAlluserFriendships,
    getallUsers,
    logoutUser,
  } from "../helpers/authActions";
  import UIState from "../stores/UI";
  import userState from "../stores/User";
  import NavLink from "../components/NavLink.svelte";
  import allUsers from "../stores/AllUsers";
  import allFriends from "../stores/allFriends";
  import { each } from "svelte/internal";

  const token = localStorage.FBtoken;
  let localUser = null;
  let localUserShort = "";
  let localUserShoten = "";
  let hour = new Date().toLocaleString();
  let filter = "Friend Requests";
  let localUsers = null;
  let allFriendsLocal = null;
  let friendshipsConfirmed = [];
  let friendRequests = [];

  const unsubState2 = allUsers.subscribe((state) => {
    if (state.users !== null) {
      localUsers = state.users;
      setTimeout(() => {
        getAlluserFriendships(localUser.credentials.email, localUsers);
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

  const unsubState3 = allFriends.subscribe((state) => {
    if (state.allFriends !== null) {
      allFriendsLocal = state.allFriends;
    }
  });

  const items = [
    { name: "All Members", value: "All Members" },
    { name: "Friend Requests", value: "Friend Requests" },
    { name: "Friends", value: "Friends" },
  ];

  onMount(() => {
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

  const createfriend = (creator, friend) => {
    createFriendship(creator, friend, localUsers);
  };

  const confirmFriend = (id) => {
    confirmFriendship(id, localUser.credentials.email, localUsers);
  };

  const navigateToInbox = () => {
    navigate("/Inbox");
  };

  const navigateToProfile = () => {
    navigate("/Profile");
  };

  const logout = () => {
    logoutUser();
  };

  onDestroy(() => {
    unsubState();
    unsubState2();
    unsubState3();
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
            <h4 in:fade class="font title">Connect with your tribe</h4>
            <p in:fade class="font subTitle">Our ePioneers come from all corners of the world</p>
          </Col>
        </Row>
        <Row>
          <Col style="padding-right: 50px">
            <p class="fontBold search">Filter</p>
            <Select bind:value={filter} filled {items} />
          </Col>
        </Row>
        <Row>
          {#if localUsers !== null && allFriendsLocal != null}
            {#if filter === "Friends"}
              {#each localUsers as user}
                {#if user.email !== localUser.credentials.email}
                  {#each allFriendsLocal as localFriend}
                    {#if (localFriend.friends.friend === user.email || localFriend.friends.creator === user.email) && localFriend.confirmed === true}
                      <Col style="display: flex" cols="3">
                        <div
                          in:fade
                          style="border-radius: 23px;width: 100%; height: 100%; background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%); opacity: 0.76; flex: 1; text-align: center"
                        >
                          <p style="color: #061058; font-family: Poppins; margin-top: 20px">{`${user.name} ${user.lastname}`}</p>

                          <Avatar size="62px" class="indigo" style="font-family: AvenirBold;">
                            {`${user.name[0]} ${user.lastname[0]}`}
                          </Avatar>
                          <p style="color: #061058; font-size: 14px; font-family: Poppins; margin-top: 20px">{user.country}</p>

                          <Button
                            on:click={navigateToInbox}
                            rounded
                            depressed
                            disabled={$UIState.loadingData}
                            class="yellow"
                            style="margin-bottom: 20px"
                          ><p style="margin-top: 17px; opacity: 1; color: white" class="fontBold">Message</p></Button
                          >
                        </div>
                      </Col>
                    {/if}
                  {/each}
                {/if}
              {/each}
            {/if}
            {#if filter === "Friend Requests"}
              {#each localUsers as user}
                {#if user.email !== localUser.credentials.email}
                  {#each allFriendsLocal as localFriend}
                    {#if localFriend.friends.friend === localUser.credentials.email && localFriend.friends.creator === user.email && localFriend.confirmed === false}
                      <Col style="display: flex" cols="3">
                        <div
                          in:fade
                          style="border-radius: 23px;width: 100%; height: 100%; background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%); opacity: 0.76; flex: 1; text-align: center"
                        >
                          <p style="color: #061058; font-family: Poppins; margin-top: 20px">{`${user.name} ${user.lastname}`}</p>

                          <Avatar size="62px" class="indigo" style="font-family: AvenirBold;">
                            {`${user.name[0]} ${user.lastname[0]}`}
                          </Avatar>
                          <p style="color: #061058; font-size: 14px; font-family: Poppins; margin-top: 20px">{user.country}</p>

                          <Button
                            on:click={() => {
                              confirmFriend(localFriend.id, localUser.credentials.email);
                            }}
                            rounded
                            disabled={$UIState.loadingData}
                            depressed
                            class="yellow "
                            style="margin-bottom: 20px"
                          ><p style="margin-top: 17px; opacity: 1; color: white" class="fontBold">Accept Request</p></Button
                          >
                        </div>
                      </Col>
                    {/if}
                  {/each}
                {/if}
              {/each}
            {/if}
            {#if filter === "All Members"}
              {#if allFriendsLocal.length > 0}
                {#each localUsers as user}
                  {#if user.email !== localUser.credentials.email}
                    {#each allFriendsLocal as localFriend}
                      {#if localFriend.dummydata === true && localFriend.email === user.email}
                        <Col style="display: flex" cols="3">
                          <div
                            in:fade
                            style="border-radius: 23px;width: 100%; height: 100%; background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%); opacity: 0.76; flex: 1; text-align: center"
                          >
                            <p style="color: #061058; font-family: Poppins; margin-top: 20px">{`${user.name} ${user.lastname}`}</p>

                            <Avatar size="62px" class="indigo" style="font-family: AvenirBold;">
                              {`${user.name[0]} ${user.lastname[0]}`}
                            </Avatar>
                            <p style="color: #061058; font-size: 14px; font-family: Poppins; margin-top: 20px">{user.country}</p>

                            <Button
                              on:click={() => {
                                createfriend(localUser.credentials.email, user.email);
                              }}
                              rounded
                              depressed
                              disabled={$UIState.loadingData}
                              class="blue white-text"
                              style="margin-bottom: 20px"
                            ><p style="margin-top: 17px; opacity: 1; color: white" class="fontBold">connect</p></Button
                            >
                          </div>
                        </Col>
                      {:else if localFriend.friends.creator === localUser.credentials.email && localFriend.friends.friend === user.email && localFriend.confirmed === false}
                        <Col style="display: flex" cols="3">
                          <div
                            in:fade
                            style="border-radius: 23px;width: 100%; height: 100%; background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%); opacity: 0.76; flex: 1; text-align: center"
                          >
                            <p style="color: #061058; font-family: Poppins; margin-top: 20px">{`${user.name} ${user.lastname}`}</p>

                            <Avatar size="62px" class="indigo" style="font-family: AvenirBold;">
                              {`${user.name[0]} ${user.lastname[0]}`}
                            </Avatar>
                            <p style="color: #061058; font-size: 14px; font-family: Poppins; margin-top: 20px">{user.country}</p>

                            <Button
                              on:click={() => {
                                createfriend(localUser.credentials.email, user.email);
                              }}
                              rounded
                              depressed
                              disabled={true}
                              class="black"
                              style="margin-bottom: 20px"
                            ><p style="margin-top: 17px; opacity: 1; color: white" class="fontBold">Pending</p></Button
                            >
                          </div>
                        </Col>
                      {:else if localFriend.friends.friend === localUser.credentials.email && localFriend.friends.creator === user.email && localFriend.confirmed === false}
                        <Col style="display: flex" cols="3">
                          <div
                            in:fade
                            style="border-radius: 23px;width: 100%; height: 100%; background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%); opacity: 0.76; flex: 1; text-align: center"
                          >
                            <p style="color: #061058; font-family: Poppins; margin-top: 20px">{`${user.name} ${user.lastname}`}</p>

                            <Avatar size="62px" class="indigo" style="font-family: AvenirBold;">
                              {`${user.name[0]} ${user.lastname[0]}`}
                            </Avatar>
                            <p style="color: #061058; font-size: 14px; font-family: Poppins; margin-top: 20px">{user.country}</p>

                            <Button
                              on:click={() => {
                                confirmFriend(localFriend.id, localUser.credentials.email);
                              }}
                              rounded
                              disabled={$UIState.loadingData}
                              depressed
                              class="yellow "
                              style="margin-bottom: 20px"
                            ><p style="margin-top: 17px; opacity: 1; color: white" class="fontBold">Accept Request</p></Button
                            >
                          </div>
                        </Col>
                      {/if}
                    {/each}
                  {/if}
                {/each}
              {:else}
                {#each localUsers as user}
                  {#if user.email !== localUser.credentials.email}
                    <Col style="display: flex" cols="3">
                      <div
                        in:fade
                        style="border-radius: 23px;width: 100%; height: 100%; background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%); opacity: 0.76; flex: 1; text-align: center"
                      >
                        <p style="color: #061058; font-family: Poppins; margin-top: 20px">{`${user.name} ${user.lastname}`}</p>

                        <Avatar size="62px" class="indigo" style="font-family: AvenirBold;">
                          {`${user.name[0]} ${user.lastname[0]}`}
                        </Avatar>
                        <p style="color: #061058; font-size: 14px; font-family: Poppins; margin-top: 20px">{user.country}</p>

                        <Button
                          on:click={() => {
                            createfriend(localUser.credentials.email, user.email, localUsers);
                          }}
                          rounded
                          depressed
                          disabled={$UIState.loadingData}
                          class="blue white-text"
                          style="margin-bottom: 20px"
                        ><p style="margin-top: 17px; opacity: 1; color: white" class="fontBold">connect</p></Button
                        >
                      </div>
                    </Col>
                  {/if}
                {/each}
              {/if}
            {/if}
          {:else}
            <ProgressLinear indeterminate={true} />
          {/if}
          <Col cols="3" />
          <Col cols="3" />
          <Col cols="3" />
          <Col cols="3" />
          <div class="profileContainer" />
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
  .search {
    color: white;
    margin-left: auto;
    margin-right: 100px;
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

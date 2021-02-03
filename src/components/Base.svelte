<script>
  import { fade } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";

  import { Avatar, ProgressLinear, Row } from "svelte-materialify";
  import { Container } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { checkLocalUserPrivate, logoutUser } from "../helpers/authActions";
  import UIState from "../stores/UI";
  import userState from "../stores/User";
  import NavLink from "./NavLink.svelte";

  const token = localStorage.FBtoken;
  let localUser = null;
  let localUserShort = "";
  let localUserShoten = "";

  const unsubState = userState.subscribe((state) => {
    localUser = state.user;
    if (state.user) {
      const localUserLongName = [state.user.credentials.name || "", state.user.credentials.lastname || ""];
      localUserShoten = `${state.user.credentials.name} ${state.user.credentials.lastname[0]}.`;
      localUserShort = localUserLongName.map((str) => str[0]).join("");
    }
  });

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

  const navigateToInbox = () => {
    navigate("/Inbox");
  };

  const logout = () => {
    logoutUser();
  };

  onDestroy(() => {
    unsubState();
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
      </Container>
    </div>
    <div class="userMenu">
      <Avatar class="indigo" style="font-family: AvenirBold; margin-right: 40px">
        {localUserShort}
      </Avatar>
      <p style="font-family: Poppins; font-size: 18px; margin-top: 10px">Mario Dena</p>
    </div>
    <img class="background" src={generalAssets.background} alt="" />
    <img class="mainLogo" src={generalAssets.dashboardLogo} alt="" />
  </div>
{/if}

<style>
  .interactableButton {
    cursor: pointer;
  }
  .mainContent {
    z-index: 900;
    position: absolute;
    width: calc(100vw - 237px);
    height: 100vh;
    right: 0px;
    top: 0px;
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



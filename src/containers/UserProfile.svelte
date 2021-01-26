<script>
  import { fade } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";

  import { Avatar, ProgressLinear, Row, Col, TextField } from "svelte-materialify";
  import { Container } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { checkLocalUserPrivate, logoutUser } from "../helpers/authActions";
  import UIState from "../stores/UI";
  import userState from "../stores/User";
  import NavLink from "../components/NavLink.svelte";

  const token = localStorage.FBtoken;
  let localUser = null;
  let localUserShort = "";
  let localUserShoten = "";
  let hour = new Date().toLocaleString();

  const unsubState = userState.subscribe((state) => {
    if (state.user) {
      localUser = state.user;
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

  const navigateToProfile = () => {
    navigate("/Dashboard");
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
  <div style="background-color: #f2f8f8">
    <div class="mainContent">
      <Container>
        <Row style="align-items: center; margin-top: 50px">
          <img class="interactableButton" style="margin-right: 20px; margin-left:auto" src={generalAssets.inviteButton} alt="" />
          <img class="interactableButton" on:click={navigateToInbox} style="margin-right: 20px;" src={generalAssets.messagesEmpty} alt="" />
          <img class="interactableButton" on:click={logout} style="margin-right: 20px;" src={generalAssets.logoutButton} alt="" />
        </Row>
        <Row>
          <Col>
            <h4 style="color: #414141;" in:fade class="font title">{`${localUser.credentials.name} ${localUser.credentials.lastname}`}</h4>
            <p style="color: #414141;" in:fade class="font subTitle">Your login information and security credentials</p>
          </Col>
        </Row>
        <Row>
          <Col style="display: flex; flax:1; justify-content: center; align-items: center" cols="2">
            <Avatar class="indigo" size="90px" style="font-family: AvenirBold;">
              {localUserShort}
            </Avatar>
          </Col>
          <Col cols="10">
            <Row style="margin-right: 50px">
              <Col>
                <p class="fontBold">First name:</p>
                <TextField style="margin-right: 10px" readonly solo value={localUser.credentials.name} />
              </Col>
              <Col>
                <p class="fontBold">Last name:</p>
                <TextField style="margin-right: 10px" readonly solo value={localUser.credentials.lastname} />
              </Col>
              <Col>
                <p class="fontBold">Birthday:</p>
                <TextField style="margin-right: 10px" readonly solo value={localUser.credentials.dateofbirth} />
              </Col>
            </Row>
            <Row style="margin-right: 50px">
              <Col>
                <p class="fontBold">Nickname:</p>
                <TextField style="margin-right: 10px" readonly solo value={localUser.credentials.nickname} />
              </Col>
              <Col>
                <p class="fontBold">City</p>
                <TextField style="margin-right: 10px" readonly solo value={localUser.credentials.lastname} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 style="color: #414141; font-size: 28px;" in:fade class="font title">Access info</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <p class="fontBold">Email address</p>
          </Col>
          <Col>
            <p class="font">{localUser.credentials.email}</p>
          </Col>
        </Row>
      </Container>
    </div>
    <div on:click={navigateToProfile} class="userMenu">
      <p style="font-family: Poppins; font-size: 18px; margin-top: 10px">Settings</p>
      <img style="margin-left: 40px; margin-top: -5px" src={generalAssets.cross} alt="" />
    </div>
    <img class="mainLogo" src={generalAssets.dashboardLogo} alt="" />
  </div>
{/if}

<style>
  .newsSubtitle {
    font-size: 14px;
    color: lightgray;
  }
  .newsTitle {
    font-family: "Poppins";
    font-size: 14px;
  }
  .time {
    color: rgba(43, 48, 52, 0.4);
    margin-top: 6px;
    margin-left: 10px;
  }
  .statsContainer2 {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 25px;
    width: 100%;
    margin-bottom: 20px;
  }
  .statsContainer {
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 25px;
    width: 100%;
    height: 91px;
    margin-bottom: 20px;
  }
  .newsContainer {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 25px;
    width: calc(100% - 80px);
    height: 91px;
    margin-left: 80px;
    margin-bottom: 20px;
  }
  .subTitle {
    font-size: 21px;
    color: white;
  }
  .title {
    font-size: 40px;
    margin-top: 80px;

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
    top: 190px;
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

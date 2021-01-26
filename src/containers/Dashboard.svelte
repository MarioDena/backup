<script>
  import { fade } from "svelte/transition";
  import { onDestroy, onMount } from "svelte";

  import { Avatar, ProgressLinear, Row, Col } from "svelte-materialify";
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
    navigate("/Profile");
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
        <Row>
          <Col>
            <h4 in:fade class="font title">{`Welcome ${localUserShoten}`}</h4>
            <p in:fade class="font subTitle">Hi Mario, this is the dashboard.</p>
          </Col>
        </Row>
        <Row>
          <Col cols="7">
            <p in:fade class="fontBold subTitle">Latest News</p>
            <div in:fade class="newsContainer">
              <p class="newsTitle">Congress approves digital nomads’ visa</p>
              <p class="font newsSubtitle">30 days ago - Posted by: ePioneers team</p>
            </div>
            <div in:fade class="newsContainer">
              <p class="newsTitle">Senate approves digital nomads’ visa</p>
              <p class="font newsSubtitle">15 days ago - Posted by: ePioneers team</p>
            </div>
            <div in:fade class="newsContainer">
              <p class="newsTitle">Official legislation is out</p>
              <p class="font newsSubtitle">2 days ago - Posted by: ePioneers team</p>
            </div>
            <div in:fade class="newsContainer">
              <p class="newsTitle">We secured a partnership with SELINA</p>
              <p class="font newsSubtitle">1 day ago - Posted by: ePioneers team</p>
            </div>
          </Col>
          <Col cols="5">
            <p in:fade class="time fontBold">{hour}</p>
            <div in:fade class="statsContainer">
              <img style="margin-left: 10px" src={generalAssets.travelsIcon} alt="" />
              <img style="margin-left: auto; margin-right: 20px" src={generalAssets.travelsButton} alt="" />
            </div>
            <div in:fade class="statsContainer2">
              <img style="margin-left: -25px; margin-top: 20px; margin-bottom: 20px" src={generalAssets.applicationStatus} alt="" />
            </div>
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

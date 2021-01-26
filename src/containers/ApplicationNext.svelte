<script>
  import applicationData from "../stores/ApplicationData.js";
  import { fade } from "svelte/transition";
  import { Button, Container, Row, ProgressCircular } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { onDestroy, onMount } from "svelte";
  import userState from "../stores/User";
  import UIState from "../stores/UI";
  import { checkLocalUserPrivate, userUpdateGenreal } from "../helpers/authActions";

  $: applicationDataLocal = $applicationData;

  let localUser;

  const unsubState = userState.subscribe((state) => {
    if (state.user) {
      localUser = state.user;
      if (state.user.credentials.aplicationsSucceded === true) {
        navigate("/Dashboard");
      }
    } else {
      navigate("/");
    }
  });

  onMount(() => {
    window.scrollTo({ top: 0 });
    const token = localStorage.FBtoken;
    UIState.update((state) => {
      return { ...state, errors: {}, loading: true, loadingData: false };
    });

    if (localUser === null) {
      if (token) {
        checkLocalUserPrivate(token);
      } else {
        logoutUser();
      }
    } else {
      if (localUser.credentials.aplicationsSucceded === true) {
        navigate("/Dashboard");
      } else {
        UIState.update((state) => {
          return { ...state, errors: {}, loading: false };
        });
      }
    }
  });

  onDestroy(() => {
    unsubState();
  });
</script>

<Container>
  <Row style="align-items: center; margin-top: 30px">
    <img in:fade class="logo" src={generalAssets.mainLogo} alt="" />
  </Row>
  <Row style="margin-top: 60px; min-height: 80vh; justify-content: center; align-items: center">
    <form in:fade>
      <h4 class="fontBold">ePioneers application</h4>
      <img style="margin-bottom: 20px" src={generalAssets.steps4} alt="" />
      <div
        style="margin-top: 40px; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 1px solid lightgrey; border-radius: 10px; padding: 50px"
      >
        <img src={generalAssets.thankyou} alt="" />
        <div style="display: flex; margin-top: 80px">
          <img style="margin-right: 20px" src={generalAssets.facebook} alt="" />
          <img style="margin-right: 20px" src={generalAssets.twitter} alt="" />
          <img style="margin-right: 20px" src={generalAssets.youtube} alt="" />
          <img src={generalAssets.linked} alt="" />
        </div>
        <img style="margin-top: 20px;" src={generalAssets.meantime} alt="" />
      </div>
    </form>
  </Row>
  <img in:fade class="world" src={generalAssets.world} alt="world" />
</Container>

<style>
  form {
    z-index: 300;
    text-align: center;
  }
  h4 {
    margin-bottom: 60px;
  }
  .logo {
    margin-left: 10px;
  }
  .world {
    z-index: 0;
    position: absolute;
    width: 303px;
    height: 458px;
    right: 0px;
    bottom: 0px;
  }
</style>

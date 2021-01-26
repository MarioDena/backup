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
      if (state.user.credentials.applied === true) {
        navigate("/PendingReview");
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
      if (localUser.credentials.applied === true || localUser.credentials.aplicationsSucceded === true) {
        if (localUser.credentials.applied === true) {
          navigate("/PendingReview");
        } else {
          navigate("/Dashboard");
        }
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

  const continueToNextScreen = (e) => {
    e.preventDefault();
    const data = { ...applicationDataLocal, applied: true };
    userUpdateGenreal(data);
  };
</script>

<Container>
  <Row style="align-items: center; margin-top: 30px">
    <img in:fade class="logo" src={generalAssets.mainLogo} alt="" />
  </Row>
  <Row style="margin-top: 60px; min-height: 80vh; justify-content: center; align-items: center">
    <form in:fade on:submit={continueToNextScreen}>
      <h4 class="fontBold">ePioneers application</h4>
      <img style="margin-bottom: 20px" src={generalAssets.steps3} alt="" />
      <div style="margin-top: 40px; display: flex; flex-direction: column; justify-content: center; align-items: center">
        <h4 class="font">Great, that’s $99 USD!</h4>
        <p class="font">
          Your application fee covers 24/7 access to our software platform for <br /> 24 months. It also includes the shipping of your
          personal and non-<br /> transferible ePioneers card.
        </p>
        <div>
          <img src={generalAssets.paymentDummy} alt="" />
        </div>
        {#if $UIState.loadingData === true}
          <ProgressCircular indeterminate={true} />
        {:else}
          <img on:click={continueToNextScreen} class="paymentButton" src={generalAssets.paymentButton} alt="" />
        {/if}
      </div>
      <Button style="visibility:hidden" type="submit" on:click={continueToNextScreen} />
    </form>
  </Row>
  <img in:fade class="world" src={generalAssets.world} alt="world" />
</Container>

<style>
  .paymentButton {
    cursor: pointer;
    margin-top: 50px;
  }
  .paymentButton:hover {
    opacity: 0.8;
  }
  p {
    text-align: left;
    color: #818181;
    font-size: 18px;
  }
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

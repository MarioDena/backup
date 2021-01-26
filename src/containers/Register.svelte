<script>
  import { checkLocalUserPublic, signupUser } from "./../helpers/authActions.js";
  import { fade } from "svelte/transition";
  import { Button, Container, ProgressLinear, Row, TextField, ProgressCircular } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { onDestroy, onMount } from "svelte";
  import UIState from "../stores/UI";
  import userState from "../stores/User.js";
  import loadImages from "../helpers/ImageLoader.js";

  let email;
  let password;
  let confirmPassword;
  let name;
  let lastname;

  $: errorMail = $UIState.errors.email || "";
  $: errorPassword = $UIState.errors.password || "";
  $: errorconfirmPassword = $UIState.errors.confirmPassword || "";
  $: errorName = $UIState.errors.name || "";
  $: errorLastName = $UIState.errors.lastname || "";

  const unsubState = userState.subscribe((state) => {
    if (state.user !== null) {
      navigate(`/Dashboard`);
    }
  });

  const goToLogIn = () => {
    navigate("/Login");
  };

  onMount(() => {
    window.scrollTo({ top: 0 });
    const token = localStorage.FBtoken;
    UIState.update((state) => {
      return { ...state, errors: {}, loading: true };
    });
    if (token) {
      checkLocalUserPublic(token);
    } else {
      UIState.update((state) => {
        return { ...state, errors: {}, loading: false };
      });
    }
  });

  const SignUp = (e) => {
    e.preventDefault();
    UIState.update((state) => {
      return { ...state, errors: {} };
    });
    const NewUser = { email, name, lastname, password, confirmPassword };
    signupUser(NewUser);
  };

  onDestroy(() => {
    unsubState();
  });
</script>

{#if $UIState.loading === true}
  <ProgressLinear indeterminate={true} />
{:else}
  <Container>
    <Row style="align-items: center; margin-top: 30px">
      <img in:fade class="logo" src={generalAssets.mainLogo} alt="" />
      <img in:fade on:click={goToLogIn} class="apply" src={generalAssets.alreadyApplied} alt="apply" />
    </Row>
    <Row style="margin-top: 60px; min-height: 80vh; justify-content: center; align-items: center">
      <form in:fade on:submit={SignUp}>
        <div>
          <h4 class="fontBold">Get started</h4>
          <div style="display: flex">
            <TextField
              hint={errorName}
              error={$UIState.errors.name || $UIState.errors.general ? true : false}
              disabled={$UIState.loadingData}
              style="margin-bottom: 20px; margin-right: 10px; width: 100px"
              color="light-blue"
              filled={true}
              bind:value={name}
            >First name</TextField
            >
            <TextField
              error={$UIState.errors.lastname || $UIState.errors.general ? true : false}
              disabled={$UIState.loadingData}
              hint={errorLastName}
              style="margin-bottom: 20px; margin-left: 10px; width: 100px"
              color="light-blue"
              filled={true}
              bind:value={lastname}
            >Last name</TextField
            >
          </div>

          <TextField
            error={$UIState.errors.email || $UIState.errors.general ? true : false}
            disabled={$UIState.loadingData}
            hint={errorMail}
            style="margin-bottom: 20px"
            color="light-blue"
            filled={true}
            bind:value={email}
          >Your email</TextField
          >
          <TextField
            error={$UIState.errors.password || $UIState.errors.general ? true : false}
            disabled={$UIState.loadingData}
            hint={errorPassword}
            style="margin-bottom: 20px"
            type="password"
            color="light-blue"
            filled={true}
            bind:value={password}
          >Choose a password (min 6 characters)</TextField
          >
          <TextField
            hint={errorconfirmPassword}
            disabled={$UIState.loadingData}
            error={$UIState.errors.confirmPassword || $UIState.errors.general ? true : false}
            type="password"
            color="light-blue"
            filled={true}
            bind:value={confirmPassword}
          >Repeat Password</TextField
          >
          <p class="font">
            I agree to receive electronic communication about my account with ePioneers, a World Tech Inc brand and in accordance to the
            company’s terms.
          </p>
          {#if $UIState.loadingData === true}
            <ProgressCircular style="margin-left: 50%; transform: translate(-50%); margin-top: 50px;" indeterminate={true} />
          {:else}
            <img on:click={SignUp} class="loginButton" src={generalAssets.createAccount} alt="" />
          {/if}

          <p class="smallwidth">By clicking “Create Account” I agree to ePioneers’ Terms of Use and Privacy Policy.</p>
        </div>
        <Button style="visibility:hidden" type="submit" on:click={SignUp} />
      </form>
    </Row>
    <img in:fade class="world" src={generalAssets.world} alt="world" />
  </Container>
{/if}

<style>
  .smallwidth {
    margin-top: 20px;
    max-width: 235px;
    margin-left: 50%;
    transform: translate(-50%);
  }
  p {
    text-align: center;
    color: #818181;
    font-size: 12px;
  }
  form {
    z-index: 300;
  }
  .loginButton {
    cursor: pointer;
    margin-left: 50%;
    transform: translate(-50%);
    margin-top: 50px;
  }
  .loginButton:hover {
    opacity: 0.7;
  }
  h4 {
    margin-bottom: 60px;
  }
  div {
    width: 400px;
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
  .apply {
    cursor: pointer;
    margin-left: auto;
    margin-top: 10px;
    margin-right: 10px;
    width: 222px;
    height: 22px;
  }
  .apply:hover {
    opacity: 0.5;
  }
</style>

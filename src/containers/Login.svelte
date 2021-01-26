<script>
  import { fade } from "svelte/transition";
  import { Button, Container, ProgressCircular, ProgressLinear, Row, TextField } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { onDestroy, onMount } from "svelte";
  import UIState from "../stores/UI";
  import { checkLocalUserPublic, loginUser } from "../helpers/authActions";
  import userState from "../stores/User";

  let email;
  let password;

  $: errorMail = $UIState.errors.email || "";
  $: errorPassword = $UIState.errors.password || "";
  $: errorGeneral = $UIState.errors.general || "";

  const goToSignup = () => {
    navigate("/Signup");
  };

  const unsubState = userState.subscribe((state) => {
    if (state.user !== null) {
      navigate(`/Dashboard`);
    }
  });

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

  const Login = (e) => {
    e.preventDefault();
    const userLog = { email, password };
    UIState.update((state) => {
      return { ...state, errors: {} };
    });
    loginUser(userLog);
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
      <img in:fade on:click={goToSignup} class="apply" src={generalAssets.applyButton} alt="apply" />
    </Row>
    <Row style=" height: 90vh; justify-content: center; align-items: center">
      <form in:fade on:submit={Login}>
        <div>
          <h4 class="fontBold">Login</h4>
          <TextField
            hint={errorMail || errorGeneral}
            error={$UIState.errors.email || $UIState.errors.general ? true : false}
            style="margin-bottom: 20px"
            color="light-blue"
            disabled={$UIState.loadingData}
            filled={true}
            bind:value={email}
          >Your email address</TextField
          >
          <TextField
            hint={errorPassword || errorGeneral}
            error={$UIState.errors.password || $UIState.errors.general ? true : false}
            type="password"
            disabled={$UIState.loadingData}
            color="light-blue"
            filled={true}
            bind:value={password}
          >Password</TextField
          >
          <a href="/Recover" class="font">Forgot Password?</a>
          {#if $UIState.loadingData === true}
            <ProgressCircular style="margin-left: 50%; transform: translate(-50%); margin-top: 50px;" indeterminate={true} />
          {:else}
            <img on:click={Login} class="loginButton" src={generalAssets.loginButton} alt="" />
          {/if}
        </div>
        <Button style="visibility:hidden" type="submit" on:click={Login} />
      </form>
    </Row>
    <img in:fade class="world" src={generalAssets.world} alt="world" />
  </Container>
{/if}

<style>
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
  a {
    text-decoration: none;
    font-size: 16px;
    float: right;
    color: #818181 !important;
  }
  a:visited {
    color: #818181;
    text-decoration: none;
  }
  a:hover {
    color: #1bacea !important;
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
    width: 221px;
    height: 23px;
  }
  .apply:hover {
    opacity: 0.5;
  }
</style>

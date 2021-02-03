<script>
  import { fade } from "svelte/transition";
  import { Button, Container, ProgressCircular, ProgressLinear, Row, TextField, Select } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { onDestroy, onMount } from "svelte";
  import UIState from "../stores/UI";
  import { checkLocalUserPublic, loginUser } from "../helpers/authActions";
  import userState from "../stores/User";

  import { dict, locale, t } from "../stores/i18n";
  import translations from "../helpers/translations";

  $: dict.set(translations);

  const options = [
    { name: "English", value: "En" },
    { name: "Español", value: "Sp" },
    { name: "Português", value: "Pr" },
  ];

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
      <div style="margin-left: 50px; width: 150px; margin-top: 10px"><Select bind:value={$locale} items={options} /></div>
      <div on:click={goToSignup} style="display: flex; margin-left: auto; cursor: pointer">
        <p class="font" style="font-size: 22px; margin-left: auto">{$t("general.applyToProgram")}</p>
        <img in:fade class="apply" src={generalAssets.applyArrow} alt="apply" />
      </div>
    </Row>
    <Row style=" height: 90vh; justify-content: center; align-items: center">
      <form in:fade on:submit={Login}>
        <div>
          <h4 class="fontBold">{$t("general.login")}</h4>
          <TextField
            hint={errorMail || errorGeneral}
            error={$UIState.errors.email || $UIState.errors.general ? true : false}
            style="margin-bottom: 20px"
            color="light-blue"
            disabled={$UIState.loadingData}
            filled={true}
            bind:value={email}>{$t("general.yourEmail")}</TextField
          >
          <TextField
            hint={errorPassword || errorGeneral}
            error={$UIState.errors.password || $UIState.errors.general ? true : false}
            type="password"
            disabled={$UIState.loadingData}
            color="light-blue"
            filled={true}
            bind:value={password}>{$t("general.password")}</TextField
          >
          <a href="/Recover" class="font">{$t("general.forgotPassword")}</a>
          {#if $UIState.loadingData === true}
            <ProgressCircular style="margin-left: 50%; transform: translate(-50%); margin-top: 50px;" indeterminate={true} />
          {:else}
            <div on:click={Login} class="loginButton fontBold">{$t("general.login")}</div>
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
    border-radius: 100px;
    color: #1bacea;
    padding: 5px;
    background-color: #f2f8f8;
    text-align: center;
    width: 108px;
    height: 33px;
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
    margin-left: 10px;
    margin-top: 5px;
    margin-right: 10px;
    height: 23px;
  }
  .apply:hover {
    opacity: 0.5;
  }
</style>

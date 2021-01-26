<script>
  import { fade } from "svelte/transition";
  import { Button, Container, Row, TextField } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { onMount } from "svelte";

  let email;
  let password;
  const goToSignup = () => {
    navigate("/Signup");
  };

  onMount(() => {
    window.scrollTo({ top: 0 });
  });

  const Login = (e) => {
    e.preventDefault();
    console.log(`${email} is and ${password}`);
  };
</script>

<Container>
  <Row style="align-items: center; margin-top: 30px">
    <img in:fade class="logo" src={generalAssets.mainLogo} alt="" />
    <img in:fade on:click={goToSignup} class="apply" src={generalAssets.applyButton} alt="apply" />
  </Row>
  <Row style=" height: 90vh; justify-content: center; align-items: center">
    <form in:fade on:submit={Login}>
      <div>
        <h4 class="fontBold">Reset password</h4>
        <TextField style="margin-bottom: 20px" color="light-blue" filled={true} bind:value={email}>Your email address</TextField>
        <img on:click={Login} class="loginButton" src={generalAssets.sendButton} alt="" />
      </div>
      <Button style="visibility:hidden" type="submit" on:click={Login} />
    </form>
  </Row>
  <img in:fade class="world" src={generalAssets.world} alt="world" />
</Container>

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

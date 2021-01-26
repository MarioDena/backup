<script>
  import generalAssets from "../data/Assets";

  import { Row, Container, ProgressLinear } from "svelte-materialify";
  import { fade } from "svelte/transition";
  import UIState from "../stores/UI";

  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";

  onMount(() => {
    window.scrollTo({ top: 0 });
  });

  const goToLogin = () => {
    navigate("/Login");
  };
</script>

<div>
  {#if $UIState.loading === true}
    <ProgressLinear indeterminate={true} />
  {:else}
    <Container>
      <Row>
        <img in:fade class="logo" src={generalAssets.mainLogo} alt="logo" />
      </Row>
      <Row>
        <p in:fade class="dashBoardFont">COLOMBIA / Quindío</p>
      </Row>
      <Row>
        <img in:fade class="title" src={generalAssets.title} alt="titlelogo" />
      </Row>
      <Row>
        <img in:fade on:click={goToLogin} class="enter" src={generalAssets.enterButton} alt="enter" />
      </Row>
      <img in:fade class="mainImage" src={generalAssets.landingImage} alt="mainImage" />
    </Container>
  {/if}
</div>

<style>
  p {
    margin-left: 10px;
    font-size: 19px;
    margin-top: 120px;
    z-index: 300;
  }
  .title {
    padding: 50px;
    z-index: 300;
    max-width: 90vw;
  }
  .logo {
    margin-left: 10px;
    margin-top: 50px;
    z-index: 300;
  }
  .mainImage {
    z-index: 0;
    position: absolute;
    right: 0;
    top: 50px;
    max-height: calc(100vh - 100px);
  }
  .enter {
    cursor: pointer;
    float: right;
    margin-left: 30px;
    margin-top: 40px;
    margin-right: 90vw;
    z-index: 300;
    opacity: 0.85;
  }
</style>

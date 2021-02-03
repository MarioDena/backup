<script>
  import applicationData from "../stores/ApplicationData.js";
  import { fade } from "svelte/transition";
  import { Button, Container, Row, TextField, Textarea, ProgressLinear, Select } from "svelte-materialify";
  import { navigate } from "svelte-routing";
  import generalAssets from "../data/Assets";
  import { onDestroy, onMount } from "svelte";
  import userState from "../stores/User";
  import UIState from "../stores/UI";
  import { checkLocalUserPrivate } from "../helpers/authActions";

  import { dict, locale, t } from "../stores/i18n";
  import translations from "../helpers/translations";

  $: dict.set(translations);

  const options = [
    { name: "English", value: "En" },
    { name: "Español", value: "Sp" },
    { name: "Português", value: "Pr" },
  ];

  let howYouLearnAboutus;
  let interest;
  let beentoColombia = "Yes";
  let planToColombia = "Yes";

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
    applicationData.update((state) => {
      return { ...state, howYouLearnAboutus, interest, planToColombia, beentoColombia };
    });
    navigate("/Payment");
  };

  const setBeenToColombia = (selection) => {
    beentoColombia = selection;
  };

  const setPlantoColombia = (selection) => {
    planToColombia = selection;
  };
</script>

{#if $UIState.loading === true}
  <ProgressLinear indeterminate={true} />
{:else}
  <Container>
    <Row style="align-items: center; margin-top: 30px">
      <img in:fade class="logo" src={generalAssets.mainLogo} alt="" />
      <div style="margin-left: 50px; width: 150px; margin-top: 10px"><Select bind:value={$locale} items={options} /></div>
    </Row>
    <Row style="margin-top: 60px; min-height: 80vh; justify-content: center; align-items: center">
      <form in:fade on:submit={continueToNextScreen}>
        <h4 class="fontBold">{$t("general.apply")}</h4>
        <img style="margin-bottom: 20px" src={generalAssets.steps2} alt="" />
        <div class="containerApp">
          <p class="fontBold marginTopSmall">{$t("general.program")}</p>
          <TextField style="margin-bottom: 20px; margin-top: 20px" color="light-blue" filled={true} bind:value={howYouLearnAboutus}
            >{$t("general.program2")}</TextField
          >

          <p class="fontBold marginTopSmall">{$t("general.interest")}</p>
          <Textarea style="margin-bottom: 20px; margin-top: 20px" color="light-blue" filled={true} bind:value={interest}
            >{$t("general.interest2")}</Textarea
          >

          <div style="display: flex; margin-top: 40px">
            <section style="min-width: 40%; height: 58px; "><p class="selection2 fontBold">{$t("general.beenTo")}</p></section>
            {#if beentoColombia === "Yes"}
              <section style="min-width: 30%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">{$t("general.yes")}</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setBeenToColombia("Yes");
                }}
                style="min-width: 30%; height: 58px; "
              >
                <p class="selection2 font">{$t("general.yes")}</p>
              </section>
            {/if}

            {#if beentoColombia === "No"}
              <section style="margin-left: 10px; min-width: 30%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">{$t("general.no")}</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setBeenToColombia("No");
                }}
                style="min-width: 30%; height: 58px; "
              >
                <p class="selection3 font">{$t("general.no")}</p>
              </section>
            {/if}
          </div>

          <div style="display: flex; margin-top: 40px">
            <section style="min-width: 40%; height: 58px; ">
              <p class="selection2 fontBold">{$t("general.travel")}</p>
            </section>
            {#if planToColombia === "Yes"}
              <section style="min-width: 30%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">Yes</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setPlantoColombia("Yes");
                }}
                style="min-width: 30%; height: 58px; "
              >
                <p class="selection2 font">Yes</p>
              </section>
            {/if}

            {#if planToColombia === "No"}
              <section style="margin-left: 10px; min-width: 30%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">No</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setPlantoColombia("No");
                }}
                style="min-width: 30%; height: 58px; "
              >
                <p class="selection3 font">No</p>
              </section>
            {/if}
          </div>

          <img on:click={continueToNextScreen} class="loginButton" src={generalAssets.continueButton} alt="" />
        </div>
        <Button style="visibility:hidden" type="submit" on:click={continueToNextScreen} />
      </form>
    </Row>
    <img in:fade class="world" src={generalAssets.world} alt="world" />
  </Container>
{/if}

<style>
  .marginTopSmall {
    margin-top: 0;
    color: black;
  }
  .selectedArrow {
    margin-left: auto;
    margin-right: 10px;
  }
  .selection3 {
    color: #5c5e6b;
    margin-top: 15px;
    margin-left: 10px;
  }
  .selection2 {
    color: #5c5e6b;
    margin-top: 15px;
  }
  .selection {
    color: #1bacea;
    margin-top: 15px;
  }
  section {
    text-align: left;
    display: flex;
    align-items: center;
    padding-left: 20px;
    cursor: pointer;
  }
  p {
    margin-top: 50px;
    text-align: left;
    color: #818181;
    font-size: 18px;
  }
  form {
    z-index: 300;
    text-align: center;
  }
  .loginButton {
    cursor: pointer;

    margin-top: 50px;
  }
  .loginButton:hover {
    opacity: 0.7;
  }
  h4 {
    margin-bottom: 60px;
  }
  .containerApp {
    width: 1000px;
    text-align: center;
    padding: 60px;
    border: 1px solid lightgray;
    border-radius: 10px;
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

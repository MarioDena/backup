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

  let nickname;
  let phone;
  let country;
  let citizenship;
  let dateofbirth;
  let mailingAdress;
  let sex = "male";

  let localUser;

  const setSex = (selection) => {
    sex = selection;
  };

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
      return { nickname, phone, country, citizenship, dateofbirth, sex, mailingAdress };
    });
    navigate("/Program");
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
        <img style="margin-bottom: 20px" src={generalAssets.steps1} alt="" />
        <div class="containerApp">
          <div style="display: flex">
            <TextField style="margin-bottom: 20px; margin-right: 10px; width: 100px" color="light-blue" bind:value={nickname}
              >{$t("general.nickname")}</TextField
            >
            <TextField type="tel" style="margin-bottom: 20px; margin-left: 10px; width: 100px" color="light-blue" bind:value={phone}
              >{$t("general.phone")}</TextField
            >
          </div>

          <div style="display: flex; margin-top: 40px">
            <TextField style="margin-bottom: 20px; margin-right: 10px; width: 100px" color="light-blue" bind:value={country}
              >{$t("general.country")}</TextField
            >
            <TextField style="margin-bottom: 20px; margin-right: 10px; width: 100px" color="light-blue" bind:value={citizenship}
              >{$t("general.city")}</TextField
            >
            <TextField
              type="date"
              placeholder="mm /dd / yy"
              style="margin-bottom: 20px; width: 100px;"
              color="light-blue"
              bind:value={dateofbirth}>{$t("general.birth")}</TextField
            >
          </div>

          <Textarea style="margin-bottom: 20px; margin-top: 50px" color="light-blue" filled={true} bind:value={mailingAdress}
            >{$t("general.mail")}</Textarea
          >

          <p class="font">{$t("general.gender")}</p>
          <div style="display: flex; margin-top: 40px">
            {#if sex === "male"}
              <section style="min-width: 33%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">{$t("general.male")}</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setSex("male");
                }}
                style="min-width: 33%; height: 58px; "
              >
                <p class="selection2 font">{$t("general.male")}</p>
              </section>
            {/if}

            {#if sex === "female"}
              <section style="margin-left: 10px; min-width: 33%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">{$t("general.female")}</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setSex("female");
                }}
                style="min-width: 33%; height: 58px; "
              >
                <p class="selection3 font">{$t("general.female")}</p>
              </section>
            {/if}

            {#if sex === "non-binary"}
              <section style="margin-left: 10px; min-width: 33%; height: 58px; background-color: #f2f8f8;  ">
                <p class="selection fontBold">{$t("general.none")}</p>
                <img class="selectedArrow" src={generalAssets.selectedArrow} alt="" />
              </section>
            {:else}
              <section
                on:click={() => {
                  setSex("non-binary");
                }}
                style="min-width: 33%; height: 58px; "
              >
                <p class="selection3 font">{$t("general.none")}</p>
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

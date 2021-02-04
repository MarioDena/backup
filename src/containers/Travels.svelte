<script>
	import { fade } from "svelte/transition";
	import { onDestroy, onMount } from "svelte";

	import {
		Avatar,
		ProgressLinear,
		Row,
		Col,
		Select,
		Button,
	} from "svelte-materialify";
	import { Container } from "svelte-materialify";
	import { navigate } from "svelte-routing";
	import generalAssets from "../data/Assets";
	import { checkLocalUserPrivate, logoutUser } from "../helpers/authActions";
	import UIState from "../stores/UI";
	import userState from "../stores/User";
	import NavLink from "../components/NavLink.svelte";
	import { dict, locale, t } from "../stores/i18n";
	import translations from "../helpers/translations";

	$: dict.set(translations);

	const options = [
		{ name: "English", value: "En" },
		{ name: "Español", value: "Sp" },
		{ name: "Português", value: "Pr" },
	];

	const token = localStorage.FBtoken;
	let localUser = null;
	let localUserShort = "";
	let localUserShoten = "";
	let hour = new Date().toLocaleString();

	const unsubState = userState.subscribe((state) => {
		localUser = state.user;
		if (state.user) {
			const localUserLongName = [
				state.user.credentials.name || "",
				state.user.credentials.lastname || "",
			];
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
			if (
				localUser.credentials.applied === false ||
				localUser.credentials.aplicationsSucceded === false
			) {
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
			<NavLink to={`/Dashboard`}
				><p class="link">
					DashBoard <img
						class="ArrowMenu"
						src={generalAssets.arrowMenu}
						alt=""
					/>
				</p></NavLink
			>
			<NavLink to={`/Community`}
				><p class="link">
					Community<img
						class="ArrowMenu"
						src={generalAssets.arrowMenu}
						alt=""
					/>
				</p></NavLink
			>
			<NavLink to={`/Travels`}
				><p class="link">
					My Travels<img
						class="ArrowMenu"
						src={generalAssets.arrowMenu}
						alt=""
					/>
				</p></NavLink
			>
			<NavLink to={`/Inbox`}
				><p class="link">
					My Inbox<img class="ArrowMenu" src={generalAssets.arrowMenu} alt="" />
				</p></NavLink
			>
		</div>
		<div class="mainContent">
			<Container>
				<Row style="align-items: end; margin-top: 50px">
					<img
						class="interactableButton"
						style="margin-right: 20px; margin-left: auto;"
						src={generalAssets.inviteButton}
						alt=""
					/>
					<div>
						<Select bind:value={$locale} items={options} />
					</div>
					<img
						class="interactableButton"
						on:click={navigateToInbox}
						style="margin-right: 20px;"
						src={generalAssets.messagesEmpty}
						alt=""
					/>
					<img
						class="interactableButton"
						on:click={logout}
						style="margin-right: 20px;"
						src={generalAssets.logoutButton}
						alt=""
					/>
				</Row>
				<Row>
					<Col>
						<h4 in:fade class="font title">{$t("general.findNeeded")}</h4>
						<p in:fade class="font subTitle">
							{$t("general.subFindNeeded")}
						</p>
					</Col>
					<Col>
						<div in:fade style="margin-top: 75px" class="statsContainer">
							<img
								style="margin-left: 10px"
								src={generalAssets.travelsIcon}
								alt=""
							/>
							<img
								style="margin-left: auto; margin-right: 20px"
								src={generalAssets.travelsButton}
								alt=""
							/>
						</div>
					</Col>
				</Row>
				<Row style="justify-content: center">
					<Col>
						<input
							type="text"
							style="font-size: 24px; background-color: white; width: 20em; margin-bottom: 10px; border-radius: 5px; justify-self: left"
							placeholder={$t("general.searchArea")}
						/>
					</Col>
					<Col>
						<Button style="background-color: yellow; color: black;">
							{$t("general.searchButton")}
						</Button>
					</Col>
				</Row>
				<Row style="justify-content: center; margin-bottom: 10px">
					<Col>
						<img
							src="https://www.w3schools.com/images/w3schools_green.jpg"
							alt=""
						/>
						<div>
							<h6>
								{$t("general.tours")}
							</h6>
						</div>
					</Col>
					<Col>
						<img
							src="https://www.w3schools.com/images/w3schools_green.jpg"
							alt=""
						/>
						<div>
							<h6>
								{$t("general.restaurants")}
							</h6>
						</div>
					</Col>
					<Col>
						<img
							src="https://www.w3schools.com/images/w3schools_green.jpg"
							alt=""
						/>
						<div>
							<h6>
								{$t("general.museums")}
							</h6>
						</div>
					</Col>
					<Col>
						<img
							src="https://www.w3schools.com/images/w3schools_green.jpg"
							alt=""
						/>
						<div>
							<h6>
								{$t("general.rentals")}
							</h6>
						</div>
					</Col>
					<Col>
						<img
							src="https://www.w3schools.com/images/w3schools_green.jpg"
							alt=""
						/>
						<div>
							<h6>
								{$t("general.health")}
							</h6>
						</div>
					</Col>
					<Col>
						<img
							src="https://www.w3schools.com/images/w3schools_green.jpg"
							alt=""
						/>
						<div>
							<h6>
								{$t("general.events")}
							</h6>
						</div>
					</Col>
				</Row>
				<Row style="justify-content: center">
					<img
						style="margin-left: 20px"
						src={generalAssets.footertravels}
						alt=""
					/>
				</Row>
			</Container>
		</div>
		<div on:click={navigateToProfile} class="userMenu">
			<Avatar
				class="indigo"
				style="font-family: AvenirBold; margin-right: 40px"
			>
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
	h6 {
		color: white;
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

<script>
  import Landing from "./containers/Landing.svelte";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import loadImages from "./helpers/ImageLoader";
  import generalAssets from "./data/Assets";
  import Login from "./containers/Login.svelte";
  import { MaterialApp } from "svelte-materialify";
  import Register from "./containers/Register.svelte";
  import Application from "./containers/Application.svelte";
  import ApplicationProgram from "./containers/ApplicationProgram.svelte";
  import ApplicationPayment from "./containers/ApplicationPayment.svelte";
  import ApplicationNext from "./containers/ApplicationNext.svelte";
  import RecoverPassword from "./containers/RecoverPassword.svelte";
  import Base from "./components/Base.svelte";
  import Dashboard from "./containers/Dashboard.svelte";
  import Community from "./containers/Community.svelte";
  import Travels from "./containers/Travels.svelte";
  import Inbox from "./containers/Inbox.svelte";
  import UserProfile from "./containers/UserProfile.svelte";

  export let url = "";

  onMount(() => {
    loadImages(generalAssets);
  });
</script>

<MaterialApp>
  <main style="position: relative; min-height: 100vh">
    <Router {url}>
      <Route path={`/Profile`} component={UserProfile} />
      <Route path={`/Inbox`} component={Inbox} />
      <Route path={`/Travels`} component={Travels} />
      <Route path={`/Community`} component={Community} />
      <Route path={`/Dashboard`} component={Dashboard} />
      <Route path={`/Recover`} component={RecoverPassword} />
      <Route path={`/PendingReview`} component={ApplicationNext} />
      <Route path={`/Payment`} component={ApplicationPayment} />
      <Route path={`/Program`} component={ApplicationProgram} />
      <Route path={`/Application`} component={Application} />
      <Route path={`/Signup`} component={Register} />
      <Route path={`/Login`} component={Login} />
      <Route path={`/`} component={Landing} />
    </Router>
  </main>
</MaterialApp>

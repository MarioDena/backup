<script>
  import { Link } from "svelte-routing";

  export let to = "";

  const getProps = ({ location, href, isPartiallyCurrent, isCurrent }) => {
    const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

    if (isActive) {
      return { class: "active" };
    }
    return {};
  };
</script>

<Link {to} {getProps} style="color: blue">
  <slot />
</Link>

<style>
  :global(a.active) {
    color: #1529bc !important;
    text-decoration: none;
  }

  :global(a, a:visited) {
    text-decoration: none;
    font-family: AvenirRegular;
    font-size: 16px;
    color: #7f7f81;
  }

  :global(a) {
    color: #7f7f81 !important;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>

<template>
  <div class="full-screen" id="error-page">
    <div class="container">
      <span class="error-num">5</span>
      <div class="eye"></div>
      <div class="eye"></div>

      <p>
        <span class="text-2xl text-error"> w{{ cao }} </span>
        <span class="mx-3">!</span> 发生了未知错误 error
      </p>
      <nuxt-link to="/" class="btn btn-primary">返回首页</nuxt-link>
    </div>
  </div>
</template>

<script setup>
const { cao } = useTitle();

onMounted(() => {
  const elPage = document.querySelector("#error-page");

  const eyes = document.querySelectorAll(".eye");
  const [eye0, eye1] = eyes;

  elPage.addEventListener("mousemove", (event) => {
    moveEye(event, eye0);
    moveEye(event, eye1);
  });

  const moveEye = (event, eye) => {
    var x = eye.offsetLeft + eye.style.width / 2;
    var y = eye.offsetTop + eye.style.height / 2;
    var rad = Math.atan2(event.pageX - x, event.pageY - y);
    var rot = rad * (180 / Math.PI) * -1 + 180;
    eye.style.transform = "rotate(" + rot + "deg)";
  };
});
</script>

<style lang="postcss" scoped>
.full-screen {
  @apply w-screen h-screen text-center;
  font-family: "Arial Black";
  background: linear-gradient(
    to right bottom,
    #6d327c,
    #485da6,
    #00a1ba,
    #01b18e,
    #32b37b
  );
}

@media (prefers-color-scheme: dark) {
  .full-screen {
    background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
  }
}
.container {
  padding-top: 4em;
  @apply w-1/2 block mx-auto my-0 text-base-100 dark:text-base-content;
}

.error-num {
  font-size: 8em;
}

.eye {
  @apply bg-base-100 dark:bg-base-content rounded-full inline-block h-24 relative w-24;

  &::after {
    @apply bg-base-content dark:bg-base-100 rounded-full;
    content: " ";
    bottom: 56.1px;
    height: 33px;
    position: absolute;
    right: 33px;
    width: 33px;
  }
}

p {
  margin-bottom: 4em;
}
</style>

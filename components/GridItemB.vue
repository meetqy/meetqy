<template>
  <article class="article-b" @click="$router.push('/posts')">
    <div class="tags">
      <a href="javascript:;">Solar System</a>
    </div>

    <header>
      <div
        class="featured-image"
        :style="`background-image:url(${props.bgUrl})`"
      ></div>
      <div class="flex justify-center mt-5 flex-col items-center">
        <time class="flex items-center capitalize">
          <i class="text-2xl iconfont" style="color: #e84e89">&#xe8b4;</i>
          <span class="ml-2 text-sm">June 5, 2019</span>
        </time>
      </div>
    </header>

    <main class="text-center px-4">
      <h1 class="title py-2 text-center">
        Mars is the fourth planet from the Sun
      </h1>
      <p class="text-opacity-60 text-black font-light text-center">
        Mars is the fourth planet from the Sun and the second-smallest planet in
        the Solar System after Mercury…
      </p>
    </main>

    <footer class="flex justify-between items-center mt-10">
      <a href="javascript:;" class="flex items-center">
        <span
          class="author-image"
          style="
            background-image: url('http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/avatar-2.jpg');
          "
        ></span>
        <span class="author-name">Steve Kotchen</span>
      </a>
      <div class="text-sm text-black text-opacity-60">
        <a href="javascript:;">
          <span class="mr-1">23719</span>
          <i class="iconfont" style="color: #e84e89">&#xe8f4;</i>
        </a>
        <a href="javascript:;" class="ml-4">
          <span class="mr-1">23719</span>
          <i class="iconfont" style="color: #e84e89">&#xe8b5;</i>
        </a>
      </div>
    </footer>
  </article>
</template>

<script lang="ts" setup>
interface Props {
  bgUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  bgUrl:
    "http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/423994-PDRVB5-888-op.jpg",
});
</script>

<style lang="postcss">
.article-b {
  @apply rounded-2xl relative bg-white z-10;
  cursor: pointer;
  box-shadow: 0 3px 12px -1px rgb(7 10 25 / 5%),
    0 22px 27px -20px rgb(7 10 25 / 5%);

  .tags {
    @apply absolute w-full -top-4 right-0 text-center;

    a {
      @apply text-white rounded-3xl  font-semibold py-2 px-6;
      background-color: #c580e3;
    }
  }

  .title {
    @apply text-2xl mb-3 mt-3 font-semibold   text-center;
    letter-spacing: 0.6px;
  }

  header {
    .featured-image {
      @apply rounded-t-2xl bg-cover;
      height: 225px;
    }
  }

  footer {
    @apply border-t-2 border-black border-opacity-5 py-4 px-4;

    .author-image {
      background-image: url(http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/avatar-2.jpg);
      @apply w-9 h-9 rounded-full mr-2 inline-block bg-cover;
    }

    .author-name {
      letter-spacing: 0.5px;
      @apply text-sm;
    }
  }
}
</style>

<template>
  <article
    class="article-a"
    :style="`background-image:url(${props.bgUrl})`"
    @click="$router.push('/posts')"
  >
    <div class="tags">
      <a href="javascript:;">Solar System</a>
    </div>

    <header class="relative flex justify-center items-center flex-col px-4">
      <time class="flex items-center text-white capitalize">
        <i class="text-2xl iconfont">&#xe8b4;</i>
        <span class="ml-2 text-sm">June 5, 2019</span>
      </time>
    </header>

    <main class="text-white text-center px-4">
      <h1 class="title py-2">Mars is the fourth planet from the Sun</h1>
      <p class="text-opacity-60">
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
      <div class="text-white text-sm">
        <a href="javascript:;">
          <span class="mr-1">23719</span>
          <i class="iconfont">&#xe8f4;</i>
        </a>
        <a href="javascript:;" class="ml-4">
          <span class="mr-1">23719</span>
          <i class="iconfont">&#xe8b5;</i>
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
    "http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/480016-PGKTGR-852-600x450.jpg",
});
</script>

<style lang="postcss">
.article-a {
  @apply rounded-2xl pt-10 relative bg-cover;
  box-shadow: 0 3px 12px -1px rgb(7 10 25 / 5%),
    0 22px 27px -20px rgb(7 10 25 / 5%);

  .tags {
    @apply absolute w-full -top-4 right-0 text-center;

    a {
      @apply text-white rounded-3xl  font-semibold py-2 px-6;
      background-color: #ed586c;
    }
  }

  .title {
    @apply text-2xl mb-3 mt-3 font-semibold text-white  text-center;
    letter-spacing: 0.6px;
  }

  footer {
    @apply border-t-2 border-white border-opacity-50 py-4 px-4;

    .author-name {
      letter-spacing: 0.5px;
      @apply text-white text-sm;
    }

    .author-image {
      background-image: url(http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/avatar-2.jpg);
      @apply w-9 h-9 rounded-full mr-2 inline-block bg-cover;
    }
  }
}
</style>

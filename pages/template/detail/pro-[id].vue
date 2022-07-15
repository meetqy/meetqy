<template>
  <nuxt-layout name="tools">
    <div class="tools-body overflow-hidden relative">
      <iframe
        class="w-full h-full"
        :src="`${useTemplateUrl()}/beauty-template/en/${file[0]}/${file[1]}`"
        frameborder="0"
        @load="onLoad"
        ref="iframe"
        allow="clipboard-read;clipboard-write"
      />

      <div
        class="w-full h-full left-0 top-0 absolute flex justify-center items-center bg-base-100 bg-opacity-50"
        v-if="loading"
      >
        <img class="w-32" src="/loading.svg" />
      </div>
    </div>
  </nuxt-layout>
</template>

<script setup>
const route = useRoute();
const { id } = route.params;

const loading = ref(true);

const iframe = ref();

const onLoad = (e) => {
  loading.value = false;
};

const { data } = await useAsyncData(`posts/${id}`, () =>
  useStrapi4().find(`posts/${id}`, {
    publicationState: useIsProducton() ? "live" : "preview",
  })
);

const post = computed(() => data.value.data.attributes);

const file = post.value.title.split(" Part ");

const ultraName = computed(() => ultra[file[1]]);

onMounted(async () => {
  iframe.value.addEventListener("load", (e) => {
    loading.value = false;
  });

  useHead({
    titleTemplate: `${post.value.title}:${ultraName.value[1]} - 模板`,
  });
});
</script>

<template>
  <nuxt-layout name="tools">
    <div class="tools-body overflow-hidden">
      <iframe
        class="w-full h-full"
        :src="`https://wcao.cc/beauty-template/en/card/${file[1]}`"
        frameborder="0"
      ></iframe>
    </div>
  </nuxt-layout>
</template>

<script setup>
const route = useRoute();
const { id } = route.params;

const { data } = await useAsyncData(`posts/${id}`, () =>
  useStrapi4().find(`posts/${id}`, {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["tags"],
  })
);

const post = computed(() => {
  return data.value.data.attributes;
});

const tags = computed(() => post.value.tags.data);

const file = post.value.title.split(" Part ");

const ultraName = computed(() => ultra[file[1]]);

onMounted(() => {
  console.log(ultraName.value);
  useHead({
    titleTemplate: `${post.value.title}:${ultraName.value[1]} - ${tags.value
      .map((item) => item.attributes.name)
      .join(",")}模板`,
  });
});
</script>

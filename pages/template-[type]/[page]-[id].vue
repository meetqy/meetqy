<template>
  <Fragment
    :fragments="fragments"
    :title="post.title"
    :desc="post.desciption"
  />
</template>

<script setup>
const route = useRoute();

const { type, page, id } = route.params;

const fragments = ref([]);

const pageSize = 5;

onMounted(async () => {
  const d = await import("~/fragments/card/1.html");

  for (let i = page; i <= pageSize; i++) {
    /* @vite-ignore */
    // import("./assets/fragments/card/1.html").then((res) => {
    //   fragments.value.push({
    //     name: ultra[i],
    //     code: res.default,
    //   });
    // });
    fragments.value.push({
      name: ultra[i],
      code: d["default"],
    });
  }
});

const { data } = await useAsyncData("template-[type]", () =>
  useStrapi4().find(`posts/${id}`, {
    populate: ["fragments"],
  })
);

const post = computed(() => data.value.data.attributes);
</script>

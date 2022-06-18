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

onMounted(async () => {
  const pageSize = 5;

  for (let i = page; i <= pageSize; i++) {
    import(`../../fragment/${type}/${i}.html`).then((res) => {
      fragments.value.push({
        name: ultra[i],
        code: res.default,
      });
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

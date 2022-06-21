<template>
  <div>
    <Fragment
      :fragments="fragments"
      :title="post.title"
      :desc="post.desciption"
    />
  </div>
</template>

<script setup>
const route = useRoute();

const { type, page, id } = route.params;

const fragments = ref([]);

const pageSize = 5;
const count = pageSize * page;
const start = (page - 1) * pageSize + 1;

const baseURL = useBaseUrl();

for (let i = start; i <= count; i++) {
  const { data: d } = await useFetch(`/fragments/${type}/${i}.html`, {
    baseURL,
  });

  if (!d.value) break;

  fragments.value.push({
    name: ultra[i],
    code: d.value,
  });
}

const { data } = await useAsyncData(`template-${type}-${id}`, () =>
  useStrapi4().find(`posts/${id}`, {
    populate: ["fragments"],
  })
);
// console.log(data.value);

const post = computed(() => data.value.data.attributes);

onMounted(() => {
  console.log(post.value);
  useHead({
    titleTemplate: post.value.title,
    meta: [
      {
        name: "description",
        content: post.value.desciption,
      },
    ],
  });
});
</script>

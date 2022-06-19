<template>
  <div>
    <Fragment
      :fragments="fragments"
      :title="post.title"
      :desc="post.desciption"
    />
    123
  </div>
</template>

<script setup>
const route = useRoute();

const { type, page, id } = route.params;

const fragments = ref([]);

const pageSize = 5;

for (let i = page; i <= pageSize; i++) {
  const index = Number((page - 1) * pageSize + i);
  const { data: d } = await useFetch(`/fragments/${type}/${index}.html`, {
    baseURL:
      process.env.NODE_ENV === "prodcuton"
        ? "https://wcao.cc"
        : "http://localhost:3000",
  });

  fragments.value.push({
    name: ultra[i],
    code: d.value,
  });
}

const { data } = await useAsyncData("template-[type]", () =>
  useStrapi4().find(`posts/${id}`, {
    populate: ["fragments"],
  })
);

const post = computed(() => data.value.data.attributes);
</script>

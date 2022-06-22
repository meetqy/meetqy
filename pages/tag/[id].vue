<template>
  <NuxtLayout>
    <div>
      <div class="mt-12 flex justify-center px-32">
        <div class="navbar bg-base-100 rounded-box bg-opacity-20 h-24">
          <a class="btn btn-ghost normal-case text-2xl m-auto">{{
            tag.name
          }}</a>
        </div>
      </div>
      <PostList :posts="posts" />
    </div>
  </NuxtLayout>
</template>

<script setup>
const { params } = useRoute();
const { id } = params;

const { data: postsRes } = await useAsyncData("posts-tag-" + id, () =>
  useStrapi4().find("posts", {
    publicationState: useIsProducton() ? "live" : "preview",
    populate: ["category", "headerImages", "tags"],
    filters: {
      tags: {
        id: {
          $in: [id],
        },
      },
    },
    pagination: {
      page: 1,
      pageSize: 15,
    },
  })
);

const posts = computed(() => postsRes.value.data);

const tag = computed(
  () =>
    posts.value[0].attributes.tags.data.filter((item) => item.id === +id)[0]
      .attributes
);
</script>

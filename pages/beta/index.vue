<template>
  <NuxtLayout>
    <div class="columns-4 gap-4 mt-12">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Iframe 加载模板</h2>
          <p>模板和blog分离，模板支持多语言、多主题预览，数据基于mockjs</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">
              <nuxt-link to="/beta/template">体验</nuxt-link>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

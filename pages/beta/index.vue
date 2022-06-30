<template>
  <NuxtLayout>
    <div class="grids grid-cols-4 gap-4 mt-12 h-screen">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Iframe 加载模板</h2>
          <p>模板和blog分离，模板支持多语言、多主题预览，数据基于mockjs</p>
          <div class="card-actions justify-end">
            <nuxt-link to="/beta/template">
              <button class="btn btn-primary">体验</button>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<template>
  <div class="m-auto h-screen overflow-hidden flex flex-col">
    <Header :height="64" class="px-32 container m-auto flex-shrink-0">
      <slot name="title"></slot>
    </Header>

    <div class="flex-1">
      <slot></slot>
    </div>

    <Footer
      class="flex justify-center items-center py-4 flex-shrink-0"
      :show-logo="false"
    />
  </div>
</template>

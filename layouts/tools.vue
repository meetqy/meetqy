<template>
  <div class="m-auto h-screen overflow-hidden flex-col flex">
    <Header class="container m-auto flex-shrink-0 h-16 px-32">
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

<template>
  <div class="m-auto h-screen overflow-hidden flex-col flex">
    <Header class="container m-auto flex-shrink-0 h-20 xl:px-32 px-4">
      <slot name="title"></slot>
    </Header>

    <div class="flex-1">
      <slot></slot>
    </div>

    <Footer
      class="flex justify-center items-center flex-shrink-0 h-20"
      :show-logo="false"
    />
  </div>
</template>

<template>
  <div class="multi-columns">
    <div class="block">
      <grid-item-a
        bg-url="http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/8048-op.jpg"
      />
    </div>
    <div class="block"><grid-item-b /></div>
    <div class="block"><grid-item-b /></div>
    <div class="block">
      <grid-item-a
        bg-url="http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/480016-PGKTGR-852-600x450.jpg"
      />
    </div>
    <div class="block"><grid-item-b /></div>
    <div class="block"><grid-item-a /></div>
    <div class="block"><grid-item-b /></div>
    <div class="block">
      <grid-item-a
        bg-url="http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/8048-op.jpg"
      />
    </div>
    <div class="block"><grid-item-a /></div>
    <div class="block"><grid-item-b /></div>
    <div class="block">
      <grid-item-a
        bg-url="http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/8048-op.jpg"
      />
    </div>
    <div class="block"><grid-item-b /></div>
  </div>
</template>

<style>
.multi-columns {
  column-count: 3;
  column-gap: 40px;
  padding-top: 40px;
}

.block {
  display: block;
  word-wrap: break-word;
  padding: 30px 0;
  page-break-inside: avoid;
}
</style>

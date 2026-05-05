<template>
  <img
      :src="path"
      :alt="path"
      :height="size"
  />
</template>

<script setup>
const props = defineProps({
  path: {
    type: [String],
    required: true,
    default: null,
  },
  size: {
    type: [String, Number],
    default: "24",
  },
});
</script>

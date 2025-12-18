<template>
  <div>

  </div>
</template>

<script setup>
const props = defineProps({
  img: String,
  name: String,
  number: [Number, String],
  to: {
    type: String,
    required: true
  }
});
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Engine } from "./engine";
import { rules } from "./rules";

let engine = ref(new Engine(rules));
const nextMatchedRule = computed(() => engine.value.nextMatchedRule());

watch(
  () => nextMatchedRule.value,
  (newRule) => {
    console.log("Next matched rule changed:", newRule);
    if (newRule && newRule.type === "condition") {
      console.log(engine.value.step());
    }
  },
);
</script>

<template>
  <div
    class="flex flex-col relative p-8 bg-pink-200 w-sm min-w-5/6 h-2/3 rounded-3xl m-2"
  >
    <!-- Next matched rule: {{ nextMatchedRule }} -->
    <div
      v-if="nextMatchedRule && nextMatchedRule.type === 'question'"
      class="flex flex-col items-center"
    >
      <h1 class="text-4xl font-bold mb-4 text-center">
        {{ nextMatchedRule.title }}
      </h1>

      <div v-if="nextMatchedRule.content">{{ nextMatchedRule.content }}</div>

      <img
        v-if="nextMatchedRule.image"
        :src="nextMatchedRule.image"
        class="max-h-96"
        alt="Question Image"
      />

      <div class="flex flex-col w-full items-stretch mt-16">
        <button
          v-for="(option, index) in nextMatchedRule.options"
          :key="index"
          @click="engine.applyPatch(option.patch)"
          class="btn mt-2 my-2"
        >
          {{ option.description }}
        </button>
      </div>
    </div>
    <!-- <div>
      {{ engine.fact }}
    </div> -->
  </div>
</template>

<style scoped></style>

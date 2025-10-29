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
  <div>
    {{ engine.fact }}
  </div>
  <div v-if="nextMatchedRule">
    <!-- Next matched rule: {{ nextMatchedRule }} -->
    <div v-if="nextMatchedRule.type === 'question'">
      <div>
        {{ nextMatchedRule.title }}
      </div>
      <div v-if="nextMatchedRule.content">{{ nextMatchedRule.content }}</div>
      <div v-if="nextMatchedRule.image">
        <img :src="nextMatchedRule.image" alt="Question Image" />
      </div>
      <div v-for="(option, index) in nextMatchedRule.options" :key="index">
        <button @click="engine.applyPatch(option.patch)">
          {{ option.description }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

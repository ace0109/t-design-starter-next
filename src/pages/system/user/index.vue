<script setup lang="ts">
import { ref } from 'vue'

// 生成100条mock数据
const mockData = ref(Array.from({ length: 100 }, (_, index) => index))
</script>

<template>
  <div>
    <div class="space-y-2">
      <div
        v-for="index in mockData"
        :key="index"
        class="p-4 border bg-white border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-lg font-semibold text-gray-800">
          项目 {{ index }}
        </div>
        <div class="text-sm text-gray-600 mt-1">
          这是第 {{ index }} 条数据，用于测试页面滚动效果
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

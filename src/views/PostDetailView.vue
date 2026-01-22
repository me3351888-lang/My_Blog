<template>
  <div class="min-h-screen bg-[#161616] text-white p-8">
    <div v-if="post" class="max-w-3xl mx-auto">
      <button @click="$router.push('/')" class="text-indigo-500 mb-8 flex items-center hover:underline uppercase text-xs font-bold tracking-widest">
        ← Back to Stories
      </button>

      <h1 class="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight text-white">
        {{ post.title }}
      </h1>

      <div class="flex items-center space-x-4 mb-12 pb-8 border-b border-gray-800">
        <div class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
          {{ post.authorName?.charAt(0) }}
        </div>
        <div>
          <p class="text-gray-200 font-bold text-lg">{{ post.authorName }}</p>
          <p class="text-gray-500 text-sm tracking-wide">{{ post.userEmail }} • {{ date }}</p>
        </div>
      </div>

      <div class="text-gray-300 text-xl leading-relaxed whitespace-pre-wrap font-light">
        {{ post.content }}
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div class="animate-pulse text-gray-500 tracking-widest uppercase">Loading Story...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const post = ref(null)

onMounted(async () => {
  try {
    const docRef = doc(db, 'posts', route.params.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      post.value = docSnap.data()
    }
  } catch (err) {
    console.error("Error fetching post:", err)
  }
})

const date = computed(() => {
  if (!post.value?.createdAt) return 'Just now'
  return new Date(post.value.createdAt.seconds * 1000).toLocaleDateString()
})
</script>

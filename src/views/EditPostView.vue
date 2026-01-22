<template>
  <div class="min-h-screen bg-[#161616] text-white p-8 flex items-center justify-center">
    <div class="max-w-2xl w-full bg-[#1a1a1a] p-10 rounded-2xl border border-gray-800 shadow-2xl">
      <h2 class="text-3xl font-bold mb-8 text-indigo-500 tracking-tight">Edit Your Story</h2>

      <form @submit.prevent="updatePost" class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
          <input
            v-model="title"
            type="text"
            required
            class="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
          >
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content</label>
          <textarea
            v-model="content"
            required
            rows="8"
            class="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition resize-none"
          ></textarea>
        </div>

        <div class="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-indigo-600/20"
          >
            Update Post
          </button>
          <button
            type="button"
            @click="$router.push('/')"
            class="px-6 py-3 border border-gray-800 text-gray-400 hover:bg-gray-800 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const title = ref('')
const content = ref('')

onMounted(async () => {
  const docRef = doc(db, 'posts', route.params.id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    title.value = docSnap.data().title
    content.value = docSnap.data().content
  }
})

const updatePost = async () => {
  try {
    const docRef = doc(db, 'posts', route.params.id)
    await updateDoc(docRef, {
      title: title.value,
      content: content.value
    })
    router.push('/')
  } catch (err) {
    console.error("Error updating post:", err)
  }
}
</script>

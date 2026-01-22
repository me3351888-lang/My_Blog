<template>
  <div class="min-h-screen bg-[#161616] text-white p-6 flex items-center justify-center">
    <div class="w-full max-w-xl bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
      <h2 class="text-2xl font-bold mb-6 text-indigo-500">Add New Post</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="mb-4">
          <label class="block mb-2 text-sm text-gray-400">Post Title</label>
          <input
            v-model="title"
            type="text"
            required
            class="w-full p-3 bg-black border border-gray-700 rounded outline-none focus:border-indigo-500"
          >
        </div>

        <div class="mb-6">
          <label class="block mb-2 text-sm text-gray-400">Content</label>
          <textarea
            v-model="content"
            rows="5"
            required
            class="w-full p-3 bg-black border border-gray-700 rounded outline-none focus:border-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded font-bold transition-all disabled:opacity-50"
        >
          {{ loading ? 'Publishing...' : 'Publish Post' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '@/firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default {
  setup() {
    const title = ref('')
    const content = ref('')
    const loading = ref(false)
    const router = useRouter()

    const handleSubmit = async () => {
      if (!title.value || !content.value) return

      loading.value = true
      try {
        const user = auth.currentUser
        if (user) {
          // Sending data to Firestore with userEmail
          await addDoc(collection(db, 'posts'), {
            title: title.value,
            content: content.value,
            userId: user.uid,
            userEmail: user.email,
            authorName: user.displayName || 'Anonymous',
            createdAt: serverTimestamp()
          })
          router.push('/')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error("Firestore Error:", err.message)
      } finally {
        loading.value = false
      }
    }

    return { title, content, loading, handleSubmit }
  }
}
</script>

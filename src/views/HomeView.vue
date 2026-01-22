<template>
  <div class="min-h-screen bg-[#161616] text-white font-sans">
    <nav class="flex items-center justify-between px-8 py-6 border-b border-gray-800">
      <div class="text-2xl font-bold text-indigo-500 tracking-tighter uppercase">MyBlog</div>

      <div v-if="user" class="hidden md:flex items-center text-gray-300">
        Welcome, <span class="ml-2 text-white font-bold">{{ user.displayName || 'Blogger' }}</span>
      </div>

      <div class="flex items-center space-x-4">
        <button v-if="user" @click="handleLogout" class="text-red-400 hover:text-red-300 text-sm mr-4 font-bold">
          Logout
        </button>
        <router-link v-else to="/login" class="bg-indigo-600 px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition">
          Login
        </router-link>
      </div>
    </nav>

    <header class="px-8 py-16 md:py-24 max-w-6xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Share your <span class="text-indigo-500">stories</span> with the world.
      </h1>
      <div v-if="user" class="mt-8">
        <router-link to="/createpost" class="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-full font-bold transition shadow-lg shadow-indigo-500/20">
          + Write New Article
        </router-link>
      </div>
    </header>

    <main class="px-8 pb-20 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-2xl font-bold border-l-4 border-indigo-500 pl-4">Latest Stories</h2>
      </div>

      <div v-if="posts.length === 0" class="text-center text-gray-500 py-10">
        No posts found. Start by creating one!
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <article v-for="post in posts" :key="post.id" class="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 p-6 flex flex-col h-full shadow-lg hover:border-gray-700 transition duration-300">

          <div class="flex-1">
            <h3 class="text-2xl font-bold text-white group-hover:text-indigo-400 transition mb-3">
              {{ post.title }}
            </h3>
            <p class="text-gray-400 text-sm line-clamp-3 mb-6">
              {{ post.content }}
            </p>
          </div>

          <div class="mb-5 flex flex-col border-t border-gray-800/50 pt-4">
            <span class="text-xs font-bold text-gray-200">{{ post.authorName }}</span>
            <span class="text-[10px] text-indigo-400 italic">{{ post.userEmail }}</span>
            <span class="text-[9px] text-gray-600 mt-1">{{ post.date }}</span>
          </div>

          <div class="flex items-center justify-end space-x-4">

            <router-link :to="'/post/' + post.id" class="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition tracking-[2px] uppercase">
              Read More
            </router-link>

            <div v-if="user && user.uid === post.userId" class="flex items-center space-x-3 border-l border-gray-700 pl-4">

              <button @click="goToEdit(post.id)" class="text-blue-400 hover:text-blue-300 transition" title="Edit Post">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button @click="deletePost(post.id)" class="text-red-500 hover:text-red-400 transition" title="Delete Post">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

            </div>
          </div>
        </article>
      </div>
    </main>

    <footer class="border-t border-gray-800 py-10 text-center text-gray-500 text-sm">
      <p>&copy; 2026 MyBlog Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const router = useRouter();
const user = ref(null);
const posts = ref([]);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });

  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

  onSnapshot(q, (snapshot) => {
    posts.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() : 'Just now'
    }));
  });
});

const deletePost = async (id) => {
  if (confirm('Are you sure you want to delete this story?')) {
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  }
};

const goToEdit = (id) => {
  router.push(`/edit/${id}`);
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    user.value = null;
    router.push('/login');
  } catch (err) {
    console.error("Logout error:", err);
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <section class="min-h-screen flex items-stretch text-white overflow-hidden bg-[#111]">
    <div class="lg:flex w-1/2 hidden bg-gray-900 bg-no-repeat bg-cover relative items-center"
         style="background-image: url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop');">
      <div class="absolute bg-black/50 inset-0 z-0"></div>
      <div class="w-full px-24 z-10">
        <h1 class="text-5xl font-bold tracking-tight mb-2">Welcome Back.</h1>
        <p class="text-xl text-gray-300 italic">"The secret of getting ahead is getting started."</p>
      </div>
    </div>

    <div class="lg:w-1/2 w-full flex items-center justify-center bg-[#161616] px-6 py-12">
      <div class="w-full max-w-md">
        <div class="mb-8">
          <h2 class="text-4xl font-black italic mb-2">Sign In</h2>
          <p class="text-gray-500">Please enter your details to continue.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input v-model="formData.email" type="email" placeholder="email@example.com"
                   class="w-full p-4 mt-2 bg-black/50 border border-gray-800 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all">
          </div>

          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input v-model="formData.password" type="password" placeholder="••••••••"
                   class="w-full p-4 mt-2 bg-black/50 border border-gray-800 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all">
          </div>

          <button type="submit" :disabled="loading"
                  class="w-full p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            {{ loading ? 'Processing...' : 'Login' }}
          </button>

          <div class="flex items-center my-6">
            <div class="flex-1 border-t border-gray-800"></div>
            <span class="px-4 text-gray-600 text-sm">OR</span>
            <div class="flex-1 border-t border-gray-800"></div>
          </div>

          <button @click="loginWithGoogle" type="button"
                  class="w-full flex justify-center items-center gap-3 p-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95">
            <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-5 h-5" alt="Google">
            Sign in with Google
          </button>
        </form>

        <p class="text-center mt-8 text-gray-500 text-sm">
          Don't have an account?
          <router-link to="/register" class="text-indigo-500 font-bold hover:underline">Sign up</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = reactive({ email: '', password: '' });
const loading = ref(false);

// Google Auth
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    router.push('/');
  } catch (err) {
    alert("Google login failed, check Firebase settings.");
  }
};

// Email/Pass Auth
const handleLogin = async () => {
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, formData.email, formData.password);
    router.push('/');
  } catch (err) {
    alert("Invalid login credentials");
  } finally {
    loading.value = false;
  }
};
</script>

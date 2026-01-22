<template>
  <section class="min-h-screen flex items-stretch text-white">
    <div class="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
         style="background-image: url(https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=675&q=80);">
      <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div class="w-full px-24 z-10 text-left">
        <h1 class="text-5xl font-bold tracking-wide">Join Us</h1>
        <p class="text-3xl my-4">Create your account and start your journey with us today.</p>
      </div>
    </div>

    <div class="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 relative" style="background-color: #161616;">
      <div class="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
           style="background-image: url(https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=675&q=80);">
        <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
      </div>

      <div class="w-full py-6 z-20">
        <h1 class="my-6">
            <svg viewBox="0 0 247 31" class="w-auto h-7 sm:h-8 inline-flex">
              <path fill="#06B6D4" d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0z"></path>
            </svg>
        </h1>

        <p class="text-gray-100">Create a new account</p>

        <form @submit.prevent="handleRegister" class="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
          <div class="pb-2 pt-4 text-left">
            <input v-model="formData.name" type="text" placeholder="Full Name"
                   class="block w-full p-4 text-lg rounded-sm bg-black border border-gray-800 focus:border-indigo-500 focus:outline-none transition-colors" required>
          </div>

          <div class="pb-2 pt-4 text-left">
            <input v-model="formData.email" type="email" placeholder="Email"
                   class="block w-full p-4 text-lg rounded-sm bg-black border border-gray-800 focus:border-indigo-500 focus:outline-none transition-colors" required>
          </div>

          <div class="pb-2 pt-4 text-left">
            <input v-model="formData.password" type="password" placeholder="Password"
                   class="block w-full p-4 text-lg rounded-sm bg-black border border-gray-800 focus:border-indigo-500 focus:outline-none transition-colors" required>
          </div>

          <div class="pb-2 pt-4 text-left">
            <input v-model="formData.confirmPassword" type="password" placeholder="Confirm Password"
                   class="block w-full p-4 text-lg rounded-sm bg-black border border-gray-800 focus:border-indigo-500 focus:outline-none transition-colors" required>
          </div>

          <div class="px-4 pb-2 pt-6">
            <button type="submit" :disabled="loading"
                    class="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none transition-all disabled:opacity-50 font-bold">
              {{ loading ? 'Creating account...' : 'Register' }}
            </button>
          </div>

          <div class="mt-4 text-gray-400">
            Already have an account?
            <router-link to="/login" class="text-indigo-500 hover:underline cursor-pointer">Login here</router-link>
          </div>

          <p v-if="error" class="text-red-500 mt-4 text-sm font-semibold">{{ error }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { auth } from '@/firebase/config';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleRegister = async () => {
  error.value = '';

  if (formData.password !== formData.confirmPassword) {
    error.value = "Passwords do not match!";
    return;
  }

  loading.value = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    await updateProfile(userCredential.user, {
      displayName: formData.name
    });

    await signOut(auth);

    router.push('/login');

  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = "This email is already in use.";
    } else if (err.code === 'auth/weak-password') {
      error.value = "Password is too weak (min 6 characters).";
    } else {
      error.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input::placeholder {
  color: #4b5563;
}
</style>

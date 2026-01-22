import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './firebase/config' // نادى على الفايربيز
import { onAuthStateChanged } from 'firebase/auth'

let app;

// استنى لما فايربيز يتأكد من المستخدم الأول
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
})

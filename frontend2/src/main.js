import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(createPinia());
app.use(router);

//Para la API de google
/*app.use(VueGoogleMaps,{
  load:{
    key: '',
    libreries: 'places',
  },
})*/
app.mount('#app');

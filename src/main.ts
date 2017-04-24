import Vue from 'vue'
import VueRouter from 'vue-router'
import {AppComponent} from './components/app'
import 'jquery'
import 'bootstrap/dist/js/bootstrap'

// register the plugin
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router: new VueRouter(),
  components: {
    'app': AppComponent
  }
});

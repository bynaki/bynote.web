import Vue from 'vue'
import Router from 'vue-router'
import 'jquery'
import 'bootstrap/dist/js/bootstrap'
import router from './router'
import {AppComponent} from './components/app'


new Vue({
  el: '#app',
  router,
  components: {
    'app': AppComponent,
  }
});

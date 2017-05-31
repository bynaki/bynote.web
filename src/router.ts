import Vue from 'vue'
import Router from 'vue-router'
import {AppComponent} from './components/app'
import {RootComponent} from './components/root'
import {AuthorComponent} from './components/author'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/author/:redirect?',
      name: 'Author',
      component: AuthorComponent,
    },
    {
      path: '/*',
      name: 'Root',
      component: RootComponent,
    },
  ]
})
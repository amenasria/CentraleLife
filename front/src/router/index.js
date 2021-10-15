import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'

Vue.use(VueRouter)
 
const routes = [
  {
    path: '/room/:room_token',
    name: 'Room',
    component: Room,
    props: {room_token: ":room_token"}
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
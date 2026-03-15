import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBars,
  faXmark,
  faChevronRight,
  faRightToBracket,
  faUserPlus,
  faHouse,
  faUsers,
  faScrewdriverWrench,
  faBriefcase,
  faRankingStar,
  faClipboardList,
  faGear,
  faTrophy,
  faAward,
  faStar,
  faLocationDot,
  faEnvelope,
  faPhone,
  faClock,
  faImage,
  faPenToSquare,
  faTrashCan,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import './assets/styles/main.css';
import App from './App.vue';
import router from './router';

library.add(
  faBars,
  faXmark,
  faChevronRight,
  faRightToBracket,
  faUserPlus,
  faHouse,
  faUsers,
  faScrewdriverWrench,
  faBriefcase,
  faRankingStar,
  faClipboardList,
  faGear,
  faTrophy,
  faAward,
  faStar,
  faLocationDot,
  faEnvelope,
  faPhone,
  faClock,
  faImage,
  faPenToSquare,
  faTrashCan,
  faMagnifyingGlass,
);

const app = createApp(App);

app.component('FontAwesomeIcon', FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.mount('#app');

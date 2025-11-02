import {initFlowbite} from "flowbite";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(initFlowbite);
});
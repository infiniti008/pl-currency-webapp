import Vue  from 'vue';

const bus = new Vue();
Vue.use({
    install() {
        Vue.bus = bus;
        Vue.prototype.$bus = bus;
    }
});

export default bus;
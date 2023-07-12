import { router } from './router/index.js'
import AppHeader from './cmps/AppHeader.js'
import UserMsg from './cmps/UserMsg.js'

const options = {
	template: `
    <AppHeader />
    <RouterView />
    <userMsg />
    `,
	router,
	components: {
		AppHeader,
		UserMsg,
	},
}

const app = Vue.createApp(options)
app.use(router)
app.mount('#app')

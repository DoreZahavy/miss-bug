import { userService } from '../services/user.service.js'

export default {
	template: `
    <section v-if="user" class="bug-details">
        <h1>{{user.fullname}}</h1>
		<!-- <p>{{bug.description}}</p>
		<p>{{bug.labels?.join(' | ')}}</p>
		<p>Created At: {{time}}</p> -->

        <RouterLink to="/bug">Back</RouterLink>
    </section>
    `,
	data() {
		return {
			user: null,
		}
	},
	created() {
		const { userId } = this.$route.params
		userService
			.get(userId)
			.then((user) => {
				this.user = user
			})
			.catch((err) => {
				alert( err)
				this.$router.push('/bug')
			})
	},
	computed: {
	
	}
}

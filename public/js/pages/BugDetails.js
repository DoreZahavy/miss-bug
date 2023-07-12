import { bugService } from '../services/bug.service.js'

export default {
	template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
		<p>{{bug.description}}</p>
		<p>{{bug.labels?.join(' | ')}}</p>
		<p>Created At: {{time}}</p>

        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <RouterLink to="/bug">Back</RouterLink>
    </section>
    `,
	data() {
		return {
			bug: null,
		}
	},
	created() {
		const { bugId } = this.$route.params
		bugService
			.get(bugId)
			.then((bug) => {
				this.bug = bug
			})
			.catch((err) => {
				alert( err.response.data)
				this.$router.push('/bug')
			})
	},
	computed: {
		time() {
			const d = new Date(this.bug.createdAt)
			return d.toLocaleString()
		}
	}
}

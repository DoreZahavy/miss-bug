
import { utilService } from "../services/util.service.js"

export default {
	template: `
        <section class="bug-filter">
			<fieldset>
				<legend>Search</legend>
				<input placeholder="Search" type="text" v-model="filterBy.txt">
			</fieldset>
			<fieldset>
				<legend>Severity</legend>
				<input placeholder="Bug severity" min="0" max="5" type="number" v-model="filterBy.minSeverity">
			</fieldset>
			<fieldset>  
                <legend>Labels</legend>
                <select v-model="filterBy.labels" multiple>
                    <option>critical</option>
                    <option>need-CR</option>
                    <option>dev-branch</option>
                </select>
            </fieldset>
			<fieldset>
				<legend>Sort</legend>
				<select v-model="filterBy.sortBy">
                    <option value=""></option>
                    <option value="severity">severity</option>
                    <option value="title">title</option>
                    <option value="createdAt">time created</option>
                </select>
			</fieldset>
			<button @click="filterBy.sortDir*=-1" class="sort-dir">Sort Direction</button>
        </section>
    `,
	data() {
		return {
			filterBy: {
				txt: '',
				labels: [],
				minSeverity: 0,
				sortBy:'',
				sortDir:1
			},
		}
	},
	created() {
		this.filter = utilService.debounce(() => {
			this.$emit('filter', this.filterBy)
		}, 450)
	},
	watch: {
		filterBy: {
			handler() {
				this.filter()
			},
			deep: true,
		},
	},
}

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import BugFilter from '../cmps/BugFilter.js'
import BugList from '../cmps/BugList.js'

export default {
  template: `
		<section class="bug-app">
			<div class="subheader">
				<BugFilter @filter="setFilterBy"/>
				<RouterLink to="/bug/edit">Add New Bug</RouterLink> 
			</div>
			<BugList v-if="bugs" :bugs="bugs" @remove="removeBug"/>

      <section class="pagination">
        <button @click="getPage(-1)" :disabled="!filterBy.pageIdx">Prev</button>
				  <p>{{currPage}}</p>
        <button @click="getPage(1)" :disabled="filterBy.pageIdx + 1 === maxPageCount">Next</button>
      </section>
		</section>
    `,
  data() {
    return {
      bugs: [],
      filterBy: {
        txt: '',
        pageIdx: 0,
        labels: [],
        minSeverity: 0,
        sortBy: '',
        sortDir: 1
      },
      maxPageCount: 0
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy)
        .then(({ bugs, maxPageCount }) => {
          this.maxPageCount = maxPageCount
          this.bugs = bugs
        })
        .catch(err => {
          showErrorMsg('Cannot load bugs')
        })
    },
    removeBug(bugId) {
      bugService
        .remove(bugId)
        .then(() => {
          const idx = this.bugs.findIndex(bug => bug._id === bugId)
          this.bugs.splice(idx, 1)
          showSuccessMsg('Bug removed')
        })
        .catch(err => {
          showErrorMsg('Cannot remove bug')
        })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, pageIdx: 0 }
      this.loadBugs()
    },
    getPage(dir) {
      if (this.filterBy.pageIdx === 0 && dir === -1) return
      this.filterBy.pageIdx + 1 === this.maxPageCount && dir === 1 ? this.filterBy.pageIdx : this.filterBy.pageIdx += dir
      this.loadBugs()
    }

  },
  computed: {
    currPage() {
      return `${this.filterBy.pageIdx + 1} / ${this.maxPageCount}`
    }
  },
  components: {
    BugFilter,
    BugList,
  },
}

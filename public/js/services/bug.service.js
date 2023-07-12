import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

// const BUG_KEY = 'bugDB'

var gFilterBy = { title: '' }

// _createBugs()

export const bugService = {
	query,
	get,
	getEmptyBug,
	save,
	remove,
	setFilterBy,
	getFilterBy,
}

const BASE_URL = '/api/bug/'
window.bugService = bugService

function query(filterBy = { txt: '', minSeverity: 0, sortBy: '', labels: [], sortDir: 1, pageIdx: 0 }) {
	return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function get(bugId) {
	return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
	return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
	if (bug._id) {
		return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
	} else {
		return axios.post(BASE_URL, bug).then(res => res.data)
	}

}

function getEmptyBug(title = '', severity = '', description = '', createdAt = 0, labels = []) {
	return {
		_id: '',
		title,
		description,
		severity,
		createdAt,
		labels
	}
}

function setFilterBy(filterBy = {}) {
	if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
	return gFilterBy
}

function getFilterBy() {
	return { ...gFilterBy }
}


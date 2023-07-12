import fs from 'fs'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    get,
    remove,
    save
}

const PAGE_SIZE = 2
const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy) {
    const { txt, minSeverity, sortDir, sortBy, pageIdx, labels } = filterBy
    const regex = new RegExp(txt, 'i')

    let filteredBugs
    filteredBugs = bugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    filteredBugs = filteredBugs.filter(bug => bug.severity >= +minSeverity)
    filteredBugs = filteredBugs.filter(bug => (labels.length > 0) ? bug.labels.some(label => labels.includes(label)) : true)

    // sorting
    if (sortBy === 'title') {
        filteredBugs = filteredBugs.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortDir)
    } else if (sortBy === 'severity') {
        filteredBugs = filteredBugs.sort((b1, b2) => (b1.severity - b2.severity) * sortDir)
    } else if (sortBy === 'createdBy') {
        filteredBugs = filteredBugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * sortDir)
    }

    // pagination
    const maxPageCount = Math.ceil(filteredBugs.length / PAGE_SIZE)
    if (pageIdx !== undefined) {
        const startPageIdx = pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startPageIdx, startPageIdx + PAGE_SIZE)
    }
    return Promise.resolve({ bugs: filteredBugs, maxPageCount })
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such bug')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id)
        return Promise.reject('Not your bug')
    cars.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (idx === -1) throw new Error('No such bug')
        if (!loggedinUser.isAdmin && cars[idx].owner._id !== loggedinUser._id)
            return Promise.reject('Not your bug')
        bugs[idx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        car.owner = loggedinUser
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)

}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
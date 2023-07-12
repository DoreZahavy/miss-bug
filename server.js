import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { pdfService } from './services/pdf.service.js'
import { utilService } from './services/util.service.js'

import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()


// Express Config:
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))


// download pdf
app.get('/api/download', (req, res) => {
    bugService
        .query()
        .then((bugs) => {
            loggerService.info(`Downloaded Bugs`)
            const fileName = `bugs-${utilService.makeId()}`
            pdfService.buildBugsPDF(bugs, fileName).then(() => {
                const filePath = path.join(__dirname, 'pdf', `${fileName}.pdf`)
                console.log('filePath:', filePath)
                res.sendFile(filePath)
            })
        })
        .catch((err) => {
            loggerService.error('Cannot download Bugs', err)
            res.status(400).send('Cannot download Bugs')
        })
})


// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: req.query.minSeverity || 0,
        sortBy: req.query.sortBy || '',
        sortDir: req.query.sortDir || 1,
        labels: req.query.labels || [],
        pageIdx: req.query.pageIdx || 0,
    }
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Save Bug (/UPDATE)
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot save bug')

    const { _id, title, description, severity, createdAt, labels } = req.body
    const bugToSave = { _id, title, description, severity, createdAt, labels }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Save Bug (CREATE)
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot save bug')

    const { title, description, severity, createdAt, labels } = req.body
    const bugToSave = { title, description, severity, createdAt, labels }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Delete bug (DELETE)
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')

    const bugId = req.params.bugId
    bugService.remove(bugId, loggedinUser)
        .then(bug => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug ${bugId} Removed`)
            // res.redirect('/api/bug')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {

    const bugId = req.params.bugId

    let visitedBugs = req.cookies.visitedBugs || []
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)




    bugService.get(bugId)
        .then(bug => {

            if (visitedBugs.length > 3) {
                return res.status(401).send('Wait for a bit')
            } else {
                res.cookie('visitedBugs', visitedBugs, { maxAge: 9 * 1000 })
                res.send(bug)
            }
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug', err)
        })
})

// Delete bug (DELETE)
// app.get('/api/bug/:bugId/remove', (req, res) => {
//     const bugId = req.params.bugId
//     bugService.remove(bugId)
//         .then(bug => {
//             loggerService.info(`Bug ${bugId} removed`)
//             res.send(`Bug ${bugId} Removed`)
//             // res.redirect('/api/bug')
//         })
//         .catch((err) => {
//             loggerService.error('Cannot remove bug', err)
//             res.status(400).send('Cannot remove bug')
//         })
// })



app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch(err => {
            console.log('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.end()
})

// Get User (READ)
app.get('/api/auth/:userId', (req, res) => {
        const userId = req.params.userId
    
        const loggedinUser = userService.validateToken(req.cookies.loginToken)
        if (!loggedinUser) return res.status(401).send('Cannot get user')
    
        userService.get(userId, loggedinUser)
            .then(user => {
                res.send(user)
            })
            .catch((err) => {
                loggerService.error('Cannot get user', err)
                res.status(400).send('Cannot get user', err)
            })
    })


const port = 3031
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)


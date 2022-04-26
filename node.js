const express = require('express')
const node = express()
const path = require('path');
const port = 80
var fs = require('fs');
module.exports = {
    node: (app) => {
        node.use(express.json());
        node.use(express.urlencoded({ extended: true }));
        node.get('/state', (req, res) => {
            res.send(app.getStateForAPI())
        })
        node.post('/state', (req, res) => {
            for (const key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    app[key] = req.body[key]
                }
            }
            res.send(app.getStateForAPI())
        })
        node.post('/setColor', (req, res) => {
            app.setColor(`0x${req.body.color.replace('#', '')}`);
            res.send(app.getStateForAPI());
        })
        node.get('/stopAnimations', (req, res) => {
            app.stopAnimations().then(() => {
                res.send(app.getStateForAPI())
            })
        })
        node.get('/startAnimations', (req, res) => {
            app.startAnimations().then(() => {
                res.send(app.getStateForAPI())
            })
        })

        node.get('/', (req, res) => {
            const index = fs.readFileSync(path.join(__dirname, '/index.html')).toString()
            const vue = fs.readFileSync(path.join(__dirname, '/vue/app.js')).toString()
            res.end(index.replace("PLACEHOLDER", vue))
        })

        node.listen(port, () => {
            console.log(`Node app listening at http://localhost:${port}`)
        })
        return node
    }
}

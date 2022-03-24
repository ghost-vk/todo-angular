const express = require('express')
const app = express()

const requireHTTPS = (req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.use(requireHTTPS)

app.use(express.static('./dist/todo-angular/'))

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/todo-angular/' })
})

app.listen(process.env.PORT || 8080)

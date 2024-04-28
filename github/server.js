let canvas; size = 100

function make_canvas(n) {
    canvas = [];
    for (let i = 0; i < n; i++) {
        canvas[i] = [];
        for (let j = 0; j < n; j++) {
            canvas[i][j] = {
                r: 1,
                g: 1,
                b: 1
            }
        }
    }
}
function update_canvas(row, col, new_r, new_g, new_b) {
    canvas[row][col] = {
        r: new_r,
        g: new_g,
        b: new_b
    }
}

function reset_canvas(n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            canvas[i][j] = {
                r: 1,
                g: 1,
                b: 1
            }
        }
    }
}

make_canvas(size);
let a = JSON.stringify(canvas)
const express = require("express")
const app = express()
const port = 3000
var path = require('path');

app.get("/", function (req, res) {
    console.log("POLUCHIH GET REQUEST")
    res.status(200)
    res.sendFile(path.join(__dirname, '/public/start.html'));
});

app.get("/game.js", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/game.js'));
})


let pas = 1234

app.get("/map", function (req, res) {
    console.log("POLUCHIH GET REQUEST")
    res.status(200)
    res.send(a)
});

app.delete("/map", function (req, res) {
    console.log("POLUCHIH DELETE REQUEST")
    res.status(200)
    if (parseInt(req.query.password) == pas) {
        reset_canvas(size)
        a = JSON.stringify(canvas)
        console.log('ok')
    } else {
        console.log('not ok')
        console.log(req.query.password)
    }
    res.send(a)
});

app.listen(port, function () {
    console.log("Server is listening on port " + port)
})



app.put("/risuvai", function (req, res) {
    let x
    let y
    let r
    let g
    let b

    console.log(req.query.X)
    console.log(req.query.Y)
    console.log(req.query.R)
    console.log(req.query.G)
    console.log(req.query.B)
    res.status(200)

    x = check(req.query.X, size - 1, 0, res)
    y = check(req.query.Y, size - 1, 0, res)
    r = check(req.query.R, 255, 0, res)
    g = check(req.query.G, 255, 0, res)
    b = check(req.query.B, 255, 0, res)
    res.send('The numbers that will be put in the table are: ' + x + ', ' + y + ', ' + r + ', ' + g + ', ' + b)

    console.log(x)
    console.log(y)
    console.log(r)
    console.log(g)
    console.log(b)
    update_canvas(x, y, r, g, b)
    a = JSON.stringify(canvas)
})

function check(r, upLimit, downLimit, res) {
    let n
    if (isNaN(parseInt(r))) {
        res.status(400)
        res.send(r + ' must be a number')
        return 0
    } else {
        if (parseInt(r) <= upLimit && parseInt(r) >= downLimit) {
            n = parseInt(r)
            return n
        } else {
            res.status(400)
            res.send(r + ' must be bigger than ' + downLimit + ', and smaller than ' + upLimit)
            return 0
        }
    }
}
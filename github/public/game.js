let canvas = document.getElementById('canvas-id')
let context = canvas.getContext('2d')

let updates = 0
let secondsLeft = 10

let rainbow = { r: 0, g: 0, b: 0 }
function calcRainbow() {
    rainbow.r += Math.random() / 2
    rainbow.g += Math.random() / 2
    rainbow.b += Math.random() / 2

    if (rainbow.r > 255) {
        rainbow.r = 0
    }

    if (rainbow.g > 255) {
        rainbow.g = 0
    }

    if (rainbow.b > 255) {
        rainbow.b = 0
    }

    unlockColors[13] = { r: rainbow.r, g: rainbow.g, b: rainbow.b }
}

let unlockReq = [0, 50, 100, 500, 1000, 1500, 2000, 3000, 4500, 6000, 8000, 10000, 15000, 20000]
let unlockColors = [{ r: 127, g: 127, b: 127 }, { r: 255, g: 255, b: 255 }
    , { r: 1, g: 1, b: 1 }, { r: 0, g: 255, b: 0 }
    , { r: 0, g: 0, b: 255 }, { r: 255, g: 0, b: 0 }
    , { r: 127, g: 0, b: 0 }, { r: 255, g: 255, b: 0 }
    , { r: 255, g: 127, b: 0 }, { r: 0, g: 255, b: 127 }
    , { r: 0, g: 255, b: 255 }, { r: 127, g: 0, b: 255 }
    , { r: 255, g: 0, b: 127 }, { r: rainbow.r, g: rainbow.g, b: rainbow.b }]

let placedBlocks = 0


let frame = { x: 0, y: 0 }


if (localStorage.getItem("savePlacedBlocks") != null) {
    placedBlocks = localStorage.getItem("savePlacedBlocks")
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight
let smaller = 0

let isMousePressed = false

let cameraX = 1000, cameraY = 1000
let scale = 1
function init() {
    frame.x = 0 % 7 * canvas.height * 0.04 + 120
    frame.y = 0 * canvas.height * 0.04 + canvas.height * 0.91
}

function calculateSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    if (canvas.height > canvas.width) {
        smaller = canvas.width
    } else {
        smaller = canvas.height
    }

    blockSize = ((smaller - 20) / map.length) * 5
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight

if (canvas.height > canvas.width) {
    smaller = canvas.width
} else {
    smaller = canvas.height
}

let map = []
let blockSize = 100
let mouseX = 1, mouseY = 1
let pressed = 0
let selected = { r: 127, g: 127, b: 127 }

var xmlhttp = new XMLHttpRequest();
var xmlhttp2 = new XMLHttpRequest();


// map = xmlhttp.currentTarget
// console.log(xmlhttp.currentTarget)

function onMapLoad(obj) {
    map = JSON.parse(obj.currentTarget.responseText)
    console.log(obj.currentTarget.responseText)
}

function getMap() {
    xmlhttp.open("GET", window.location.href + "map", true);
    xmlhttp.send();
    xmlhttp.addEventListener('load', onMapLoad)
}
setInterval(getMap, 10000)

function update() {
    calcRainbow()

    blockSize = ((smaller - 20) / map.length) * 5


    if (pressed === 'q') {
        scale *= 1.5
    }

    if (pressed === 'e') {
        scale /= 1.5
    }

    if (updates % 100 == 0) {

    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = 'rgb(' + selected.r + ',' + selected.g + ',' + selected.b + ')'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.translate(-cameraX + canvas.width, -cameraY + canvas.height)

    context.lineWidth = smaller / 5 * scale
    context.strokeStyle = 'red'
    context.strokeRect(-5 * scale, -5 * scale, blockSize * map.length * scale, blockSize * map.length * scale)
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map.length; y++) {
            context.fillStyle = 'rgb(' + map[x][y].r + ',' + map[x][y].g + ',' + map[x][y].b + ')'
            context.fillRect(x * blockSize * scale, y * blockSize * scale, blockSize * scale + 1, blockSize * scale + 1)
        }
    }
    context.translate(cameraX - canvas.width, cameraY - canvas.height)

    context.fillStyle = 'white'
    context.fillRect(0, smaller * 0.9, canvas.width, smaller * 0.1)

    context.fillStyle = 'black'
    context.font = (smaller * 0.1) + 'px Calibri'
    context.fillText(placedBlocks, 5, smaller * 0.98, 100)

    context.strokeStyle = 'rgb(' + selected.r + ',' + selected.g + ',' + selected.b + ')'
    context.lineWidth = 5
    context.strokeRect(5, smaller * 0.91, 100, smaller * 0.075)

    for (let i = 0; i < unlockReq.length; i++) {
        if (placedBlocks >= unlockReq[i]) {
            let y = 0
            if (i < 7) { y = 0 } else { y = 1 }

            context.fillStyle = 'rgb(' + unlockColors[i].r + ',' + unlockColors[i].g + ',' + unlockColors[i].b + ')'
            context.fillRect(i % 7 * smaller * 0.04 + 120, y * smaller * 0.04 + smaller * 0.91, smaller * 0.04, smaller * 0.04)

            context.lineWidth = 2
            context.strokeStyle = 'gray'
            context.strokeRect(i % 7 * smaller * 0.04 + 120, y * smaller * 0.04 + smaller * 0.91, smaller * 0.04, smaller * 0.04)

            context.lineWidth = 2
            context.strokeStyle = 'black'
            context.strokeRect(frame.x, frame.y, smaller * 0.04, smaller * 0.04)
        }
    }
}
setInterval(draw, 100)

addEventListener('mousemove', function (e) {
    if (isMousePressed) {
        cameraX += (mouseX - e.clientX) * 1.2
        cameraY += (mouseY - e.clientY) * 1.2
    }
    mouseX = e.clientX
    mouseY = e.clientY
})

addEventListener('mousedown', function (e) {
    isMousePressed = true
})

addEventListener('mouseup', function (e) {
    for (let i = 0; i < unlockReq.length; i++) {
        let y = 0
        if (i < 7) { y = 0 } else { y = 1 }

        if (isPointColliding(i % 7 * smaller * 0.04 + 120, y * smaller * 0.04 + smaller * 0.91, smaller * 0.04, smaller * 0.04, mouseX, mouseY)) {
            if (placedBlocks >= unlockReq[i]) {
                selected = unlockColors[i]
                frame.x = i % 7 * smaller * 0.04 + 120
                frame.y = y * smaller * 0.04 + smaller * 0.91
            }
        }
    }
    isMousePressed = false
})

addEventListener('keydown', function (e) {
    pressed = e.key
})

addEventListener('keyup', function (e) {
    if (pressed === ' ') {
        if (mouseX < map.length * blockSize && mouseY < map.length * blockSize) {
            if (!isPointColliding(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1, mouseX, mouseY)) {
                let prX = Math.floor((mouseX + cameraX - canvas.width) / scale / blockSize)
                let prY = Math.floor((mouseY + cameraY - canvas.height) / scale / blockSize)

                if (map[prX][prY] != 'rgb(' + selected.r + ',' + selected.g + ',' + selected.b + ')') {
                    map[prX][prY] = 'rgb(' + selected.r + ',' + selected.g + ',' + selected.b + ')'

                    xmlhttp2.open("PUT", window.location.href + "risuvai?X=" + prX + "&Y=" + prY + "&R=" + selected.r + "&G=" + selected.g + "&B=" + selected.b)
                    xmlhttp2.send();
                    placedBlocks++

                    localStorage.setItem("savePlacedBlocks", placedBlocks);

                    getMap()
                }
            }
        }
    }

    pressed = 0
})

addEventListener('resize', function (e) {
    calculateSize()
})

setInterval(update, 100)
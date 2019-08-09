let preTime = 2000;
let score = 0;

//下落物體的厚度
let noteThick = 40;
//按鍵燈光
let keySpotlight = [0, 0, 0, 0];
//按鍵DFJK
const bindKey = [68, 70, 74, 75];
//播放音樂
let aud = document.getElementById("myAudio");
//Canvas
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let linear = ctx.createLinearGradient(75, 650, 75, 400);
linear.addColorStop(0, "#9ED3FF");
linear.addColorStop(1, "rgba(0,0,0,0)");
//偵測鍵盤按下與放開
window.addEventListener("keydown", processKeydown, false);
window.addEventListener("keyup", processKeyup, false);

function removeKeyListener() {
    window.removeEventListener("keydown", processKeydown, true);
    window.removeEventListener("keyup", processKeyup, true);
}

function startTime() {
    if (preTime > 0) {
        time = -preTime;
        preTime -= 5;
        setTimeout(startTime, 5);
        return;
    }
    if (preTime == 0) {
        aud.play();
        preTime = -1;
        draw();
    }
    if (aud.ended) {
        removeKeyListener();
    }

}


function hitEvent(combNum) {
    score += 5 - combNum;
    
}
//事件:按下鍵盤
let keyID = 0;

function processKeydown(e) {
    keyID = e.keyCode;
    for (i = 0; i < 4; i++) {
        if (bindKey[i] === keyID) {
            keySpotlight[i] = -1;
            drawSpotlight();
            drawScore();
            drawCombo();
            break;
        }
    }
    //播放音樂
    if (keyID == 32) {
        startTime();
    }

};

//事件:放開鍵盤
function processKeyup(e) {
    let keyID = e.keyCode;
    for (i = 0; i < 4; i++) {
        if (bindKey[i] === keyID) {
            keySpotlight[i] = 0;
            ctx.clearRect(i * 100, 500, 100, 100);
            break;
        }
    }

}
var pos = 0;

function drawNotes() {
    ctx.save();
    let intervalFlag = [];

    intervalFlag.push(setInterval(function randomLine() {
        let line = Math.floor(Math.random() * 4);
        Notes(line * 100, pos, 100, 40);
    }, 1000 / 4));

    function Notes(x, y, w, h) {
        if (!aud.ended) {
            let intervalFlagNote = setInterval(function obj() {
                ctx.save();
                let lastX = x;
                let lastY = y;
                y += 15;
                ctx.clearRect(lastX, lastY, w, 100);
                let color = "#91bef0"
                if (x >= 100 && x < 300) {
                    color = "pink"
                }
                ctx.fillStyle = color;
                ctx.fillRect(x, y, w, h);

                if (keySpotlight[x / 100] == -1 && (y > 500 && y < 600)) {
                    hitEvent(0);
                    drawSpotlight();
                } 

                if (y > c.height) {
                    clearInterval(intervalFlagNote);
                }
                intervalFlag.push(intervalFlagNote);
                intervalFlag.shift();
                ctx.restore();
            }, 1000 / 50)
        }

    }



    ctx.restore();
}

//繪製按鍵燈光
function drawSpotlight() {
    ctx.save();
    for (col = 0; col < 4; col++) { //分四欄
        if (keySpotlight[col] === 0) {
            continue;
        }
        let width = 0;
        if (keySpotlight[col] === -1) {
            width = 100;
        };
        let L = col * 100;
        ctx.fillStyle = linear;
        ctx.fillRect(L, 500, width, 100);
        // console.log(L);

    }
    ctx.restore();
}


function drawScore() {
    document.getElementById("scoreArea").innerText = score;
}

function draw() {
    drawNotes();
    drawSpotlight();
    drawScore();
}
var FPS = 60;
var c = document.getElementById("my");
var ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//window.setInterval(live, 1000/FPS);
//window.addEventListener("keydown", keypress);

var face = {
    x: 0, y: 0,
    width: 1
};
var leave = true;

var map = {}; // You could also use an array
onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */

    if (map[39]) changes.c += 1.5;
    if (map[37]) changes.c -= 1.5;
    if (map[38]) face.speedy -= 1.5;
    if (map[40]) face.speedy += 1.5;
    if (map[13]) leave = !leave;

    if (map[65]) grid();
    if (map[68]) small.speedx += 1;
    if (map[87]) draw();
    if (map[83]) small.speedy += 1;
}
var bar_a = 0;
function draw_dot(x, color, count_y) {
    y = count_y(x);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.arc(x, ctx.canvas.height - y*5, 1, 0, 360 / 180 * Math.PI);
    ctx.fill();
    return y;
}

window.onload = function () {
    grid();
    draw();
}
function grid() {
    var str = "";
    for (i = 0; i < ctx.canvas.width; i += 10) {
        str = str + i + ",";
        ctx.strokeStyle = "#777";
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
    }
    for (i = 0; i < ctx.canvas.height; i += 10) {
        str = str + i + ",";
        ctx.strokeStyle = "#777";
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }

    console.log(str);
}
function move(f) {
    if (f.x % 50 == 0) console.log(f)
    f.x = f.x + 1;
    if (f.x > ctx.canvas.width) {
        f.x = 0;
    }
}
function draw() {
    r1 = [];
    r2 = [];
    for(var i = 0; i < 101; i++ ) {
        y1 = draw_dot(i, "#800", function(x) { return 89 - (Math.log2(x))});
        y2 = draw_dot(i, "#800", function(x) { return 89 - 2*Math.pow(x*0.0142,8)-Math.pow(x*0.019,2)});
        if( i < 101 && i % 10 == 0) {
            r1.push(y1);
            r2.push(y2);
        }
    }
    console.log(r1);
    console.log(r2);

}

function live() {
    move(face);
    if (!leave) ctx.clearRect(0, 0, c.width, c.height);
    draw_dot(face);
}


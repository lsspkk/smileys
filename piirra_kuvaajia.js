var c = document.getElementById("my");
var ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var SCALE = 5;
window.onload = function () {
    grid();
    draw();
}


function grid() {
    var str = "";
    for (i = 0; i < ctx.canvas.width; i += 10) {
        str = str + i + ",";
        ctx.strokeStyle = i% 100 ? "#ddd" : "#777";
        ctx.beginPath();
        ctx.moveTo(i*SCALE, 0);
        ctx.lineTo(i*SCALE, ctx.canvas.height);
        ctx.stroke();
    }
    for (i = 0; i < ctx.canvas.height; i += 10) {
        str = str + i + ",";
        ctx.strokeStyle = i% 100 ? "#ddd" : "#777";
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height-i*SCALE);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height-i*SCALE);
        ctx.stroke();
    }

    //console.log(str);
}
function draw() {
    r1 = [];
    r2 = [];
    for(var i = 0; i < 101; i++ ) {
        y1 = draw_function(i, "#800", function(x) { return 89 - (Math.log2(x))});
        y2 = draw_function(i, "#080", function(x) { return 89 - 2*Math.pow(x*0.0142,8)-Math.pow(x*0.019,2)});
        if( i < 101 && i % 10 == 0) {
            r1.push(y1);
            r2.push(y2);
        }
    }
    console.log(r1);
    console.log(r2);
}
function draw_function(x, color, y_function) {
    y = y_function(x);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.arc(x*SCALE, ctx.canvas.height - y*SCALE, 1, 0, 360 / 180 * Math.PI);
    ctx.fill();
    return y;
}



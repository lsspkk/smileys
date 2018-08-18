var FPS = 2;
var c = document.getElementById("my");
var ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth ;
ctx.canvas.height = window.innerHeight ;

window.setInterval(live, 1000/FPS);
//window.addEventListener("keydown", keypress);

var face = { 
    x: c.width / 4, y: c.height / 2, a: 0,
    speedx:0,speedy:0,
    width:50,mouth:30,eye:8,
    bg: '#ff0', fg: '#000',
    smile:0
};
var leave = false;
var changes = {
    c: 1,
    happy_limit: 100,
    sad_limit: 0
};

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
    
    if( map[39] ) changes.c +=1.5;
    if( map[37] ) changes.c -=1.5;
    if( map[38] ) face.speedy -=1.5;
    if( map[40] ) face.speedy +=1.5;
    if( map[13] ) leave = !leave;

    if( map[65] ) small.speedx -= 1;
    if( map[68] ) small.speedx += 1;
    if( map[87] ) small.speedy -= 1;
    if( map[83] ) small.speedy += 1;
}
var bar_a = 0;
function draw_dot(f) {
    ctx.beginPath();
    ctx.fillStyle = f.bg;
    ctx.strokeStyle = "#ffffff";
    ctx.arc(f.x,f.y,f.width,0, 360/180*Math.PI);
    ctx.fill();
    draw_mouth(f);
    ctx.beginPath();
    ctx.fillStyle =f.fg;
    ctx.arc(f.x-f.mouth/2,f.y-f.eye,f.eye/2,0, 360/180*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = f.fg;
    ctx.arc(f.x+f.mouth/2,f.y-f.eye,f.eye/2,0, 360/180*Math.PI);
    ctx.fill();
    ctx.stroke();
}
function draw_mouth(f) {
    ctx.strokeStyle = f.fg;
    ctx.beginPath();
    if( f.smile == 0 ) {
        ctx.moveTo(f.x-f.mouth,f.y+f.mouth/2);
        ctx.lineTo(f.x+f.mouth,f.y+f.mouth/2);
    }
    else {
        deltay = -1* (1001 -((f.smile) * 10 ));
        deltaa = 89 - Math.pow(x*0.019,5);
        console.log(f.smile, deltay, deltaa);
        ctx.arc(f.x, f.y+deltay+f.mouth/2, Math.abs(deltay), deltaa / 180 * Math.PI, (180-deltaa) / 180 * Math.PI);
    }
    ctx.stroke();
}

function slowdown(f, amount, limit) {
    f.speedy = f.speedy/amount;
    f.speedx = f.speedx/amount;
    if( Math.abs(f.speedx) + Math.abs(f.speedy) < limit ) {
        f.speedx = 0;
        f.speedy = 0;
    }
}




function slowdown2(f, amount) {
    if( f.speedx > amount ) f.speedx -= amount;
    if( f.speedx < amount && f.speedx > 0) f.speedx = 0;
    if( f.speedx < -amount ) f.speedx += amount;
    if( f.speedx > -amount && f.speedx < 0) f.speedx = 0;
    if( f.speedy > amount ) f.speedy -= amount;
    if( f.speedy < amount && f.speedy > 0) f.speedy = 0;
    if( f.speedy < -amount ) f.speedy += amount;
    if( f.speedy > -amount && f.speedy < 0) f.speedy = 0;
}
function move(f) {
    f.x = f.x+f.width*2;
    if( f.x > ctx.canvas.width ) { 
        f.x = 0+f.width;
        f.y = f.y + f.width*2;
    }
    if( f.y > ctx.canvas.height ) {
        if( !leave ) ctx.clearRect(0, 0, c.width, c.height);
        f.y = 0+f.width;
    }
}
function change_smile(f) {
    f.smile += changes.c;
    if( f.smile > changes.happy_limit || f.smile < changes.sad_limit ) {
        changes.c = - changes.c;
    }
}
function live() {
    //move(face);

    slowdown(face, 1.01, 0.001);
    if( !leave ) ctx.clearRect(0, 0, c.width, c.height);
    draw_dot(face);
    change_smile(face);
}


var FPS = 10;
var c = document.getElementById("my");
var ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth ;
ctx.canvas.height = window.innerHeight ;

window.setInterval(live, 1000/FPS);
//window.addEventListener("keydown", keypress);

var face = { 
    x: 50, y: 50, a: 0,
    speedx:0,speedy:0,
    width:50,mouth:30,eye:10,
    bg: '#ff0', fg: '#000',
    smile:69
};
var leave = true;
var changes = {
    c: 4,
    happy_limit: 106,
    sad_limit: 62
};

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
    
    if( map[39] ) changes.c +=1.5;
    if( map[37] ) changes.c -=1.5;
    if( map[13] ) leave = !leave;
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
    ctx.arc(f.x-f.mouth/2,f.y-f.eye,f.eye/3,0, 360/180*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = f.fg;
    ctx.arc(f.x+f.mouth/2,f.y-f.eye,f.eye/3,0, 360/180*Math.PI);
    ctx.fill();
    ctx.stroke();
}
function draw_mouth(f) {
    ctx.strokeStyle = f.fg;
    ctx.beginPath();
    if( f.smile > changes.sad_limit ) {
        deltay = -1* (10*f.mouth -((f.smile) * f.mouth/12.1 ));
        deltaa = 88 - 5*Math.pow(f.smile*f.mouth/30*0.0124,9)-Math.pow(f.smile*f.mouth/35*0.011,2);
        ctx.arc(f.x, f.y+deltay+f.mouth/2.6+Math.pow(f.smile*0.046,2), Math.abs(deltay), deltaa / 180 * Math.PI, (180-deltaa) / 180 * Math.PI);
    } else {
        deltay = (10*f.mouth -((-f.smile) * f.mouth/12.1 ));
        deltaa = 88 - 5*Math.pow(f.smile*f.mouth/30*0.0124,9)-Math.pow(f.smile*f.mouth/35*0.011,2);
        ctx.arc(f.x, f.y+deltay+f.mouth/1.1-Math.pow(f.smile*0.046,2), Math.abs(deltay), (355-deltaa) / 180 * Math.PI, (185+deltaa) / 180 * Math.PI);
    }
    //    console.log(f.smile, deltay, deltaa);
    ctx.stroke();
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
    if( (f.smile  + changes.c <= changes.sad_limit && f.smile > changes.sad_limit) ||
        (f.smile + changes.c > -changes.sad_limit && f.smile <= -changes.sad_limit) ) {
        f.smile = -f.smile;
    }
    f.smile += changes.c;
    if( f.smile > changes.happy_limit || f.smile < -changes.happy_limit ) {
        changes.c = - changes.c;
    }
 
}
function live() {
    move(face)
    if( !leave ) ctx.clearRect(0, 0, c.width, c.height);
    draw_dot(face);
    change_smile(face);
}


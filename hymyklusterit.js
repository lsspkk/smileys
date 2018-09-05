var FPS = 60;
var CLUSTER_SIZE = 20;
var CLUSTER_SIZE_FUZZ = 8;
var KID_RATIO = 3;

var INCENTER_RATIO = 3;
var TOWARDS_CENTER_RATIO = 0.01;

var c = document.getElementById("my");
var ctx = c.getContext("2d");
ctx.canvas.width = window.innerWidth ;
ctx.canvas.height = window.innerHeight ;

window.setInterval(live, 1000/FPS);
//window.addEventListener("keydown", keypress);

var base_face = { 
    x: c.width / 4, y: c.height / 2, a: 0,
    speedx:0,speedy:0,
    width:50,mouth:30,eye:8,
    bg: 'rgba(230,230,0,0.6)', fg: '#000',
    slowdown_variation: 0
};
var base_small = { 
    x: c.width / 4*3, y: c.height / 2, a: 0,
    speedx:0,speedy:0,
    width:30,mouth:18,eye:5,
    bg: 'rgba(80,42,0,0.6)', fg: '#fff',
    slowdown_variation: 0
};
var count=0;
function log() {
    if( count % 500 == 0) {
        //console.log(arguments);
    }
}

var clusters = [];
var counter = 0;
function fuzz(x, amount) {
    return x + Math.floor(Math.random() * amount) - amount/2;
 }
function draw_face(f) {
    ctx.beginPath();
    ctx.fillStyle = f.bg;
    ctx.strokeStyle = "#ffffff";
    ctx.arc(f.x,f.y,f.width,0, 360/180*Math.PI);
    ctx.fill();
    ctx.strokeStyle = f.fg;
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.mouth,f.mouth/2/180*Math.PI, 150/180*Math.PI);
    ctx.stroke();
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
function slowdown(f, amount, limit) {
    f.speedy = f.speedy/amount;
    f.speedx = f.speedx/amount;
    if( Math.abs(f.speedx) + Math.abs(f.speedy) < limit ) {
        f.speedx = 0;
        f.speedy = 0;
    }
}


function move_and_wrap(f) {
    f.x = (((f.x + f.speedx)  % c.width)+c.width) % c.width;
    f.y = (((f.y + f.speedy)  % c.height)+c.height) % c.height;
}
 
class Cluster { 
     constructor(face, slowdown_factor) {
         this.face = face;
         this.slowdown_factor = slowdown_factor;
         this.kids = [];
         this.populate();
     }
     fuzz_face(face) {
        var new_kid = JSON.parse(JSON.stringify(this.face));
        new_kid.x = fuzz(this.face.x, this.face.width*4);
        new_kid.y = fuzz(this.face.y, this.face.width*4);
        new_kid.width = this.face.width/KID_RATIO;
        new_kid.mouth = this.face.mouth/KID_RATIO;
        new_kid.eye = this.face.eye/KID_RATIO;
        new_kid.slowdown_variation = fuzz((this.slowdown_factor-1)*1000,100)/10000;
        //console.log("-made-",new_kid);
        return new_kid;
    }
     populate() {
         this.kids = [];
        var limit = fuzz(CLUSTER_SIZE, CLUSTER_SIZE_FUZZ);
        for( var i=0; i < 30; i++) {
           this.kids.push(JSON.parse(JSON.stringify(this.fuzz_face(this.face))));
        }
    }

    move() {
        move_and_wrap(this.face);
        slowdown(this.face, this.slowdown_factor,  0.001);

        for( var i=0; i < this.kids.length; i++) {
            this.move_towards_center(this.kids[i]);
            move_and_wrap(this.kids[i]);
            slowdown(this.kids[i], this.slowdown_factor+this.kids[i].slowdown_variation,  0.001);
        }
    }
    move_towards_center(kid) {
        var to_right = ((this.face.x - kid.x) > 0 && (this.face.x-kid.x)< (c.width-this.face.x + kid.x)) ||
            ((this.face.x - kid.x) < 0 && (kid.x - this.face.x) > ( c.width - kid.x + this.face.x ));
        var to_left = !to_right;
        
        var x_dist = 0;
        if( to_right ) 
            x_dist = (this.face.x - kid.x) > 0 ? this.face.x - kid.x : c.width-kid.x + this.face.x;
        if( to_left )
            x_dist = (kid.x - this.face.x ) > 0 ? kid.x - this.face.x : c.width-this.face.x+kid.x;
            
        if( x_dist > (this.face.width*INCENTER_RATIO)) {
            var x_speed_difference = kid.speedx - this.face.speedx;
            var new_speed_difference = 0;
            var hoped_speed_difference = x_dist * TOWARDS_CENTER_RATIO;
            if( to_right ) {
                if( x_speed_difference > hoped_speed_difference ) {
                    new_speed_difference = x_speed_difference - (x_speed_difference - hoped_speed_difference)/2;
                } else {
                    new_speed_difference = hoped_speed_difference;
                }
                log( x_dist, kid.speedx, hoped_speed_difference, new_speed_difference )
                kid.speedx = (this.face.speedx < kid.speedx) ? this.face.speedx - new_speed_difference : this.face.speedx + new_speed_difference;
            }
            if( to_left ) {
                if( x_speed_difference > hoped_speed_difference ) {
                    new_speed_difference = x_speed_difference - (x_speed_difference - hoped_speed_difference)/2;
                } else {
                    new_speed_difference = hoped_speed_difference;
                }
                log( x_dist, kid.speedx, hoped_speed_difference, new_speed_difference )
                kid.speedx = (this.face.speedx > kid.speedx) ? this.face.speedx + new_speed_difference : this.face.speedx - new_speed_difference;
            }
        }

        var down = ((this.face.y - kid.y) > 0 && (this.face.y-kid.y)< (c.height-this.face.y + kid.y)) ||
            ((this.face.y - kid.y) < 0 && (kid.y - this.face.y) > ( c.height - kid.y + this.face.y ));
        var up = !down;
        
        var y_dist = 0;
        if( down ) 
            y_dist = (this.face.y - kid.y) > 0 ? this.face.y - kid.y : c.height-kid.y + this.face.y;
        if( up )
            y_dist = (kid.y - this.face.y ) > 0 ? kid.y - this.face.y : c.height-this.face.y+kid.y;
            
        if( y_dist > (this.face.width*INCENTER_RATIO)) {
            var y_speed_difference = kid.speedy - this.face.speedy;
            var new_speed_difference = 0;
            var hoped_speed_difference = y_dist * TOWARDS_CENTER_RATIO;
            if( down ) {
                if( y_speed_difference > hoped_speed_difference ) {
                    new_speed_difference = y_speed_difference - (y_speed_difference - hoped_speed_difference)/2;
                } else {
                    new_speed_difference = hoped_speed_difference;
                }
                log( y_dist, kid.speedy, hoped_speed_difference, new_speed_difference )
                kid.speedy = (this.face.speedy > kid.speedy) ? this.face.speedy + new_speed_difference : this.face.speedy - new_speed_difference;
            }
            if( up ) {
                if( y_speed_difference > hoped_speed_difference ) {
                    new_speed_difference = y_speed_difference - (y_speed_difference - hoped_speed_difference)/2;
                } else {
                    new_speed_difference = hoped_speed_difference;
                }
                log( y_dist, kid.speedy, hoped_speed_difference, new_speed_difference )
                kid.speedy = (this.face.speedy > kid.speedy) ? this.face.speedy + new_speed_difference : this.face.speedy - new_speed_difference;
            }


        }
        log(this.face.x, kid.x, to_right ? "right" : "left");
        log(this.face.x, kid.y, up ? "up": "down");
    }

    draw() {
        draw_face(this.face);
        for( var i=0; i < this.kids.length; i++) {
            draw_face(this.kids[i]);
        }
    }
    change_speedx(change) {
        this.face.speedx = this.face.speedx + change;
        for( var i=0; i < this.kids.length; i++) {
            this.kids[i].speedx = this.kids[i].speedx + change;
        }
    }
    change_speedy(change) {
        this.face.speedy = this.face.speedy + change;
        for( var i=0; i < this.kids.length; i++) {
            this.kids[i].speedy = this.kids[i].speedy + change;
        }
    }
    log() {
        log(this.face);
        for( var i=0; i < this.kids.length; i++) {
            log(this.kids[i]);
        }
    }

}

let cluster1 = new Cluster(base_face,1.01);
let cluster2 = new Cluster(base_small,1.02);
clusters.push(cluster1);
clusters.push(cluster2);

var leave = false;

function clusterchange(x_or_y, change, width) {
    for(var i=0; i < clusters.length; i++ ) {
        if( clusters[i].face.width == width ) {
            if( x_or_y == 'x' ) clusters[i].change_speedx(change);
            if( x_or_y == 'y' ) clusters[i].change_speedy(change);
        }
    }
}

function add_cluster(base, red, green, blue, eye) {
    var new_face = JSON.parse(JSON.stringify(base));
    new_face.x = fuzz(c.width/2, c.width/2-1);
    new_face.y = fuzz(c.height/2, c.height/2-1);
    new_face.fg = 'rgba(' + eye + "," + eye + "," + eye + "," + fuzz(8,2)/10 + ")";
    new_face.bg = 'rgba(' + red + "," + green + "," + blue + "," + fuzz(8,2)/10 + ")";
    var slowdown_rate = fuzz(10200, 180) / 10000;
    clusters.push(new Cluster(new_face, slowdown_rate));
}

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
    
    if( map[39] ) clusterchange('x',1.5,base_face.width);
    if( map[37] ) clusterchange('x',-1.5,base_face.width);
    if( map[38] ) clusterchange('y',-1.5,base_face.width);
    if( map[40] ) clusterchange('y',1.5,base_face.width);    
    if( map[13] ) { // ENTER
        add_cluster(base_face, fuzz(215,60), fuzz(214,60), 2, fuzz(20,19));
    }
    if( map[32] ) { // SPACE
        add_cluster(base_small, fuzz(80,40), fuzz(42,40), fuzz(40,40), fuzz(220,30));
    }
    if( map[8] ) { // backspace
        clusters.pop();
    }
    if( map[65] ) clusterchange('x',-1,base_small.width);
    if( map[68] ) clusterchange('x',1,base_small.width);
    if( map[87] ) clusterchange('y',-1,base_small.width);
    if( map[83] ) clusterchange('y',1,base_small.width);
}
var bar_a = 0;
function rotate_if_hits(id,f,a,soundId) {
    var elem = document.getElementById(id);
    var e = elem.getBoundingClientRect();
    if( f.x > e.left && f.x < e.right && f.y < e.bottom && f.y > e.top ) {
        bar_a += a;
        elem.style.transform = 'rotate('+bar_a+'deg)';
        document.getElementById(soundId).play();
    }
    else {
        document.getElementById(soundId).pause();
    }
}



function live() {
    for(var i=0; i < clusters.length; i++ ) {
        clusters[i].move();
    }
    if( !leave ) ctx.clearRect(0, 0, c.width, c.height);
    for(var i=0; i < clusters.length; i++ ) {
        clusters[i].draw();
    }
//    rotate_if_hits('bar',face,1, 'modem');
//    rotate_if_hits('bar',small,-2, 'conga');
    count++;
}



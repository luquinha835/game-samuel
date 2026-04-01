const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

let keys = {};
let foods = [];
let enemies = [];
let player;
let time = 0;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function start(type){

player = {
x:500,
y:300,
size:15,
speed:2,
vida:100,
food:0,
nivel:1,
type:type
};

if(type==="abelha") player.speed=3;
if(type==="mosca") player.speed=3.5;
if(type==="besouro") player.speed=1.8;

foods=[];
enemies=[];

for(let i=0;i<40;i++) spawnFood();
for(let i=0;i<6;i++) spawnEnemy();

gameLoop();
}

function spawnFood(){
foods.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:8,
type:Math.random()
});
}

function spawnEnemy(){

let type = Math.random();

if(type<0.5){
enemies.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:20,
speed:1.5,
type:"aranha"
});
}else{
enemies.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:25,
speed:1,
type:"sapo"
});
}

}

function update(){

time+=0.01;

let isNight = Math.sin(time)>0;

document.getElementById("time").innerText = isNight ? "Noite" : "Dia";

if(keys["w"]) player.y-=player.speed;
if(keys["s"]) player.y+=player.speed;
if(keys["a"]) player.x-=player.speed;
if(keys["d"]) player.x+=player.speed;

foods.forEach((food,i)=>{

let dx = player.x-food.x;
let dy = player.y-food.y;
let dist = Math.sqrt(dx*dx+dy*dy);

if(dist < player.size){

player.food++;

foods.splice(i,1);
spawnFood();

if(player.food % 8 === 0){
player.nivel++;
player.speed +=0.2;
}

}

});

enemies.forEach(enemy=>{

let dx = player.x-enemy.x;
let dy = player.y-enemy.y;
let dist = Math.sqrt(dx*dx+dy*dy);

enemy.x += dx/dist * enemy.speed;
enemy.y += dy/dist * enemy.speed;

if(dist < enemy.size){
player.vida -=0.4;
}

});

document.getElementById("vida").innerText=Math.floor(player.vida);
document.getElementById("food").innerText=player.food;
document.getElementById("nivel").innerText=player.nivel;

if(player.vida<=0){

alert("💀 Você morreu! Seu inseto renasceu.");
start(player.type);

}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

foods.forEach(food=>{

ctx.fillStyle="yellow";

ctx.beginPath();
ctx.arc(food.x,food.y,food.size,0,Math.PI*2);
ctx.fill();

});

enemies.forEach(enemy=>{

ctx.fillStyle = enemy.type==="aranha" ? "black" : "green";

ctx.beginPath();
ctx.arc(enemy.x,enemy.y,enemy.size,0,Math.PI*2);
ctx.fill();

});

ctx.fillStyle="white";

ctx.beginPath();
ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
ctx.fill();

}

function gameLoop(){

update();
draw();
requestAnimationFrame(gameLoop);

}

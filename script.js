"use strict";

const SCREEN_WIDTH = 900;
const SCREEN_HEIGHT = 550;
const TIMER_INTERVAL = 15; //15で大体FPS=60

var frame_timer;
var counter_1 = 0;
var counter_2 = 0;
var randomized_number_1;
var randomized_number_2;

var ball_x = SCREEN_WIDTH/2;
var ball_y = SCREEN_HEIGHT/10 * 2;
var ball_width = 10;
var ball_height = 10;
var ball_right = ball_x + ball_width;
var ball_left = ball_x;
var ball_top = ball_y;
var ball_bottom = ball_y + ball_height
var ball_center_x = ball_x + ball_width/2;
var ball_center_y = ball_y + ball_width/2;


var ball_velocity_x = 0;
var ball_velocity_y = 0;

var player_x = 50;
var player_y = SCREEN_HEIGHT/10*4;

var cpu_x = SCREEN_WIDTH - 50;
var cpu_y = SCREEN_HEIGHT/10*4;

var paddle_width = 10;
var paddle_height = 120;

var player_right = player_x + paddle_width;
var player_left = player_x;
var player_top = player_y;
var player_bottom = player_y + paddle_height;
var player_center_x = player_x + paddle_width/2;
var player_center_y = player_y + paddle_height/2;

var cpu_right = cpu_x + paddle_width;
var cpu_left = cpu_x;
var cpu_top = cpu_y;
var cpu_bottom = cpu_y + paddle_height;
var cpu_center_x = cpu_x + paddle_width/2;
var cpu_center_y = cpu_y + paddle_height/2;

var player_move_flag_right;
var player_move_flag_left;
var player_move_flag_up;
var player_move_flag_down;

var player_speed = 3;
var cpu_speed = 1.5;

var score_player = 0;
var score_cpu = 0;
var level = 1;

var game_run = false;
var level_clear = false;
var gameover = false;

//ブラウザが読み込まれたときに実行される関数
window.onload = function(){
    start();
    requestAnimationFrame(mainLoop);
}

function start(){
}

function mainLoop(){
    if (!frame_timer) {
        frame_timer = performance.now();
    }
    //インターバルを挟んで実行させる（フレームレート制限）
    if (frame_timer + TIMER_INTERVAL < performance.now()) {
        frame_timer += TIMER_INTERVAL;

        draw();
        game_manager();
        move_ball();
        check_ball_state();
        collide_player_paddle();
        collide_cpu_paddle();
        move_player_input();
        move_player();
        timer_move_cpu_x();
        move_cpu();
    }

    //ループさせる
    requestAnimationFrame(mainLoop);
}

function draw(){
    let screen = document.getElementById("screen").getContext("2d");

    //画面の上塗り
    screen.fillStyle = "#222222";
    screen.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

    //ボールの描画
    screen.fillStyle = "#ffffff";
    screen.fillRect (ball_x, ball_y, ball_width, ball_height);

    //プレイヤーの描画
    screen.fillStyle = "#ffffff";
    screen.fillRect (player_x, player_y, paddle_width, paddle_height);

    //CUPの描画
    screen.fillStyle = "#ffffff";
    screen.fillRect (cpu_x, cpu_y, paddle_width, paddle_height);

    //テキストの描画
    screen.font = "50px monospace";
    screen.fillStyle = "#ffffff";
    screen.fillText(score_player, SCREEN_WIDTH/10*2, SCREEN_HEIGHT/10*2);
    screen.fillText(score_cpu, SCREEN_WIDTH/10*8, SCREEN_HEIGHT/10*2);
    screen.fillText("LEVEL: " + level, SCREEN_WIDTH/10*4, SCREEN_HEIGHT/10*9);
    if (game_run == false){
        screen.fillText("Press [Space] to Start", SCREEN_WIDTH/10*2, SCREEN_HEIGHT/10*6);
    }
    if (gameover == true && game_run == false){
        screen.fillText("Game Over", SCREEN_WIDTH/10*3.5, SCREEN_HEIGHT/10*4.5);
    }
}

function game_manager(){
    if (ball_right >= SCREEN_WIDTH){
        score_player += 1;
        set_ball_default();
        if (score_player == 3){
            level += 1;
            cpu_speed += 0.8;
            level_clear = true;
            score_player = 0;
            score_cpu = 0;
        }
    }

    if (ball_left <= 0 && gameover == false){
        score_cpu += 1;
        set_ball_default();
        if (score_cpu == 3){
            score_player = 0;
            score_cpu = 0;
            game_run = false;
            gameover = true;
        }
    }
}

function move_ball(){
    if (game_run == true && gameover == false){
        ball_x += ball_velocity_x;
        ball_y += ball_velocity_y;

        ball_right = ball_x + ball_width;
        ball_left = ball_x;
        ball_top = ball_y;
        ball_bottom = ball_y + ball_height

        if (ball_right > SCREEN_WIDTH || ball_left < 0){
            ball_velocity_x = -ball_velocity_x; 
        }
        if (ball_top < 0 || ball_bottom > SCREEN_HEIGHT){
            ball_velocity_y = -ball_velocity_y
        }
    }
}

function check_ball_state(){
    if (game_run == true && gameover == false){
        if (ball_velocity_x < 0.1 && ball_velocity_x > -0.1 || ball_velocity_y < 0.1 && ball_velocity_y > -0.1){
            counter_1 += 1;
            if (counter_1 >= 80*3){ //80で約1秒
                restart_ball();
            }
        }
        else{
            counter_1 = 0;
        }
    }
}

function set_ball_default(){
    ball_x = SCREEN_WIDTH/2;
    ball_y = SCREEN_HEIGHT/10 * 2;
    ball_velocity_x = 0;
    ball_velocity_y = 0;
}

function restart_ball(){
    randomized_number_1 = Math.round(Math.random());
    if (randomized_number_1 == 0){
        ball_velocity_x = 3 + 0.5 * level;
    }
    else{
        ball_velocity_x = -3 - 0.5 * level;
    }
    ball_velocity_y = 1 + 0.5 * level;
}

function collide_player_paddle(){
    var player_right = player_x + paddle_width;
    var player_left = player_x;
    var player_top = player_y;
    var player_bottom = player_y + paddle_height;
    var player_center_x = player_right - paddle_width/2;
    var player_center_y = player_bottom - paddle_height/2;

    if (player_right > ball_left && player_left < ball_right && player_top < ball_bottom && player_top + 40 > ball_bottom){
        ball_velocity_x = - ball_velocity_x;
        ball_velocity_y -= 1 * level*0.5;
    }
    if (player_right > ball_left && player_left < ball_right && player_top + 40 < ball_bottom && player_top + 80 > ball_bottom){
        ball_velocity_x = - ball_velocity_x * 1.1;
    }
    if (player_right > ball_left && player_left < ball_right && player_top + 80 < ball_bottom && player_top + 120 > ball_bottom){
        ball_velocity_x = - ball_velocity_x;
        ball_velocity_y += 1 * level*0.5;
    }
}

function collide_cpu_paddle(){
    var cpu_right = cpu_x + paddle_width;
    var cpu_left = cpu_x;
    var cpu_top = cpu_y;
    var cpu_bottom = cpu_y + paddle_height;
    var cpu_center_x = cpu_right - paddle_width/2;
    var cpu_center_y = cpu_bottom - paddle_height/2;

    if (cpu_right > ball_left && cpu_left < ball_right && cpu_top < ball_bottom && cpu_top + 40 > ball_bottom){
        ball_velocity_x = - ball_velocity_x;
        ball_velocity_y -= 1 * level*0.5;
    }
    if (cpu_right > ball_left && cpu_left < ball_right && cpu_top + 40 < ball_bottom && cpu_top + 80 > ball_bottom){
        ball_velocity_x = - ball_velocity_x * 1.1;
    }
    if (cpu_right > ball_left && cpu_left < ball_right && cpu_top + 80 < ball_bottom && cpu_top + 120 > ball_bottom){
        ball_velocity_x = - ball_velocity_x;
        ball_velocity_y += 1 * level*0.5;
    }
}

function move_player_input(){
    window.onkeydown = function(inputtedValue){
        //右入力
        if (inputtedValue.keyCode == 39){
            player_move_flag_right = true
        }
        //左入力
        if (inputtedValue.keyCode == 37){
            player_move_flag_left = true
        }
        //上入力
        if (inputtedValue.keyCode == 38){
            player_move_flag_up = true
        }
        //下入力
        if (inputtedValue.keyCode == 40){
            player_move_flag_down = true
        }
    }
    
    window.onkeyup = function(inputtedValue){
        //右入力停止
        if (inputtedValue.keyCode == 39){
            player_move_flag_right = false
        }
        //左入力停止
        if (inputtedValue.keyCode == 37){
            player_move_flag_left = false
        }
        //上入力停止
        if (inputtedValue.keyCode == 38){
            player_move_flag_up = false
        }
        //下入力停止
        if (inputtedValue.keyCode == 40){
            player_move_flag_down = false
        }

        //ゲーム開始
        if (inputtedValue.keyCode == 32 && game_run == false){
            game_run = true;
        }
        if (inputtedValue.keyCode == 32 && gameover == true){
            gameover = false;
            level = 1;
        }
    }
}

function move_player(){
    var player_right = player_x + paddle_width;
    var player_left = player_x;
    var player_top = player_y;
    var player_bottom = player_y + paddle_height;
    var player_center_x = player_right - paddle_width/2;
    var player_center_y = player_bottom - paddle_height/2;

    if (!(player_right + 10 > ball_left && player_left - 10 < ball_right && player_top - 10 < ball_bottom && player_bottom + 10 > ball_top)){
        if (player_move_flag_right == true && player_right < SCREEN_WIDTH/2 - 50){
            player_x += player_speed;
        }
        if (player_move_flag_left == true && player_left > 20){
            player_x -= player_speed;
        }
        if (player_move_flag_down == true && player_bottom < SCREEN_HEIGHT){
            player_y += player_speed;
        }
        if (player_move_flag_up == true && player_top > 0){
            player_y -= player_speed;
        }
    }
}

function timer_move_cpu_x(){
    counter_2 += 1;
    if(counter_2 == 80*1){ //80で約1秒
        counter_2 = 0;
        randomized_number_2 = Math.round(Math.random()*10);
    }
}

function move_cpu(){
    var cpu_right = cpu_x + paddle_width;
    var cpu_left = cpu_x;
    var cpu_top = cpu_y;
    var cpu_bottom = cpu_y + paddle_height;
    var cpu_center_x = cpu_right - paddle_width/2;
    var cpu_center_y = cpu_bottom - paddle_height/2;
    var ball_center_x = ball_x + ball_width/2;
    var ball_center_y = ball_y + ball_width/2;

    if (!(cpu_right + 10 > ball_left && cpu_left - 10 < ball_right && cpu_top - 10 < ball_bottom && cpu_bottom + 10 > ball_top)){
        if (randomized_number_2 <= 2){
            if (cpu_left > SCREEN_WIDTH/2 + 50){
                cpu_x -= cpu_speed;
            }
        }
        if (randomized_number_2 >= 3 && randomized_number_2 <= 5){
            if (cpu_left > SCREEN_WIDTH/2 + 50){
                cpu_x = cpu_x;
            }
        }
        if (randomized_number_2 >= 6){
            if (cpu_right < SCREEN_WIDTH - 20){
                cpu_x += cpu_speed;
            }
        }
        if (cpu_center_y < ball_center_y && cpu_bottom < SCREEN_HEIGHT){
            cpu_y += cpu_speed;
        }
        if (cpu_center_y > ball_center_y && cpu_top > 0){
            cpu_y -= cpu_speed;
        }
    }
}
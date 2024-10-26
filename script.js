"use strict";

const SCREEN_WIDTH = 900;
const SCREEN_HEIGHT = 600;
const TIMER_INTERVAL = 15; //15で大体FPS=60

var frame_timer;
var counter_1 = 0;


var ball_x = 350;
var ball_y = 50;
var ball_width = 10;
var ball_height = 10;
var ball_right = ball_x + ball_width;
var ball_left = ball_x;
var ball_top = ball_y;
var ball_bottom = ball_y + ball_height
var ball_center = ball_right - ball_width/2;

var ball_velocity_x = -3;
var ball_velocity_y = 1;


var player_1_x = 50;
var player_2_x = 50;
var player_3_x = 50;
var player_1_y = SCREEN_HEIGHT/10*5 - 50;
var player_2_y = SCREEN_HEIGHT/10*5;
var player_3_y = SCREEN_HEIGHT/10*5 + 50;

var cpu_1_x = SCREEN_WIDTH - 50;
var cpu_2_x = SCREEN_WIDTH - 50;
var cpu_3_x = SCREEN_WIDTH - 50;
var cpu_1_y = SCREEN_HEIGHT/10*5 - 50;
var cpu_2_y = SCREEN_HEIGHT/10*5;
var cpu_3_y = SCREEN_HEIGHT/10*5 + 50;

var paddle_width = 10;
var paddle_height = 50;


var player_1_right = player_1_x + paddle_width;
var player_1_left = player_1_x;
var player_1_top = player_1_y;
var player_1_bottom = player_1_y + paddle_height;
var player_1_center_x = player_1_right - paddle_width/2;
var player_1_center_y = player_1_bottom - paddle_height/2;

var player_2_right = player_2_x + paddle_width;
var player_2_left = player_2_x;
var player_2_top =  player_2_y;
var player_2_bottom = player_2_y + paddle_height;
var player_2_center_x = player_2_right - paddle_width/2;
var player_2_center_y = player_2_bottom - paddle_height/2;

var player_3_right = player_3_x + paddle_width;
var player_3_left = player_3_x;
var player_3_top =  player_3_y;
var player_3_bottom = player_3_y + paddle_height;
var player_3_center_x = player_3_right - paddle_width/2;
var player_3_center_y = player_3_bottom - paddle_height/2;


var cpu_1_right = cpu_1_x + paddle_width;
var cpu_1_left = cpu_1_x;
var cpu_1_top = cpu_1_y;
var cpu_1_bottom = cpu_1_y + paddle_height;
var cpu_1_center_x = cpu_1_right - paddle_width/2;
var cpu_1_center_y = cpu_1_bottom - paddle_height/2;

var cpu_2_right = cpu_2_x + paddle_width;
var cpu_2_left = cpu_2_x;
var cpu_2_top = cpu_2_y;
var cpu_2_bottom = cpu_2_y + paddle_height;
var cpu_2_center_x = cpu_2_right - paddle_width/2;
var cpu_2_center_y = cpu_2_bottom - paddle_height/2;

var cpu_3_right = cpu_3_x + paddle_width;
var cpu_3_left = cpu_3_x;
var cpu_3_top = cpu_3_y;
var cpu_3_bottom = cpu_3_y + paddle_height;
var cpu_3_center_x = cpu_3_right - paddle_width/2;
var cpu_3_center_y = cpu_3_bottom - paddle_height/2;


var player_move_flag_right;
var player_move_flag_left;
var player_move_flag_up;
var player_move_flag_down;

var player_speed = 3;
var cpu_speed = 3;

var score_player = 0;
var score_cpu = 0;
var level = 1;

//ブラウザが読み込まれたときに実行される関数
window.onload = function(){
    requestAnimationFrame(mainLoop);
}

function mainLoop(){
    if (!frame_timer) {
        frame_timer = performance.now();
    }
    //インターバルを挟んで実行させる（フレームレート制限）
    if (frame_timer + TIMER_INTERVAL < performance.now()) {
        frame_timer += TIMER_INTERVAL;

        collide_player_paddle();
        draw();
        move_ball();
        move_player_input();
        move_player();
    }

    //ループさせる
    requestAnimationFrame(mainLoop);
}

function collide_player_paddle(){
    var player_1_right = player_1_x + paddle_width;
    var player_1_left = player_1_x;
    var player_1_top = player_1_y;
    var player_1_bottom = player_1_y + paddle_height;
    var player_2_right = player_2_x + paddle_width;
    var player_2_left = player_2_x;
    var player_2_top =  player_2_y;
    var player_2_bottom = player_2_y + paddle_height;
    var player_3_right = player_3_x + paddle_width;
    var player_3_left = player_3_x;
    var player_3_top =  player_3_y;
    var player_3_bottom = player_3_y + paddle_height;

    if (player_1_right > ball_left && player_1_left < ball_right && player_1_top < ball_bottom && player_1_bottom > ball_top){
        ball_velocity_x = - ball_velocity_x;
        ball_velocity_y -= 1 * level;
    }
    if (player_2_right > ball_left && player_2_left < ball_right && player_2_top < ball_bottom && player_2_bottom > ball_top){
        ball_velocity_x = - ball_velocity_x*1.1;
    }
    if (player_3_right > ball_left && player_3_left < ball_right && player_3_top < ball_bottom && player_3_bottom > ball_top){
        ball_velocity_x = - ball_velocity_x;
        ball_velocity_y += 1 * level;
    }
}

function draw(){
    let screen = document.getElementById("screen").getContext("2d");

    //画面の上塗り
    screen.fillStyle = "#ffffff";
    screen.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

    //ボールの描画
    screen.fillStyle = "#222222";
    screen.fillRect (ball_x, ball_y, ball_width, ball_height);

    //プレイヤーの描画
    screen.fillStyle = "#222222";
    screen.fillRect (player_1_x, player_1_y, paddle_width, paddle_height);
    screen.fillRect (player_2_x, player_2_y, paddle_width, paddle_height);
    screen.fillRect (player_3_x, player_3_y, paddle_width, paddle_height);

    //CUPの描画
    screen.fillStyle = "#222222";
    screen.fillRect (cpu_1_x, cpu_1_y, paddle_width, paddle_height);
    screen.fillRect (cpu_2_x, cpu_2_y, paddle_width, paddle_height);
    screen.fillRect (cpu_3_x, cpu_3_y, paddle_width, paddle_height);

    //テキストの描画
    screen.font = "50px monospace";
    screen.fillStyle = "#333333";
    screen.fillText(score_player, SCREEN_WIDTH/10*2, SCREEN_HEIGHT/10*2);
    screen.fillText(score_cpu, SCREEN_WIDTH/10*8, SCREEN_HEIGHT/10*2);
}

function move_ball(){
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

function reset_ball(){
    ball_x = 350;
    ball_y = 50;
    ball_velocity_x = 0;
    ball_velocity_y = 0;
    
    counter_1 += 1;
    if (counter_1 >= 80*1)
        if (level == 1){

        }
        if (level == 2){
            
        }
        if (level == 3){
            
        }
        if (level == 4){
            
        }
        if (level == 5){
            
        }
        if (level == 6){
            
        }
        if (level == 7){
            
        }
        if (level == 8){
            
        }
        if (level == 9){
            
        }
        if (level == 10){
            
        }
        if (level == 11){
            
        }
        if (level == 12){
            
        }
        if (level == 13){
            
        }
        if (level == 14){
            
        }
        if (level >= 15){
            
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
    }
}

function move_player(){
    var player_1_top = player_1_y;
    var player_2_right = player_2_x + paddle_width;
    var player_2_left = player_2_x;
    var player_3_bottom = player_3_y + paddle_height;

    if (player_move_flag_right == true && player_2_right < SCREEN_WIDTH/2 - 50 
        && player_2_right +5 < ball_left && player_2_left - 5 > ball_right && player_1_top - 5 > ball_bottom && player_3_bottom + 5 < ball_top){
        player_1_x += player_speed;
        player_2_x += player_speed;
        player_3_x += player_speed;
    }
    if (player_move_flag_left == true && player_2_left > 0){
        player_1_x -= player_speed;
        player_2_x -= player_speed;
        player_3_x -= player_speed;
    }
    if (player_move_flag_down == true && player_3_bottom < SCREEN_HEIGHT){
        player_1_y += player_speed;
        player_2_y += player_speed;
        player_3_y += player_speed;
    }
    if (player_move_flag_up == true && player_1_top > 0){
        player_1_y -= player_speed;
        player_2_y -= player_speed;
        player_3_y -= player_speed;
    }
}

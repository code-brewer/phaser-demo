
var game = new Phaser.Game(800,600, Phaser.AUTO,"parent",{
    preload: preload,
    create: create,
    update: update
})

function preload() {
    console.log("preload start========>");
    game.load.image('sky','assets/sky.png');
    console.log("sky done");
    game.load.image('ground', 'assets/platform.png');
    console.log("ground done");
    game.load.image('star', 'assets/star.png');
    console.log("star done");
    game.load.spritesheet('dude','assets/dude.png',32,48)
    console.log("dude done");
    game.load.spritesheet('baddie','assets/baddie.png',32,32)
    console.log("baddie done");
    console.log("preload end========>");
}

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var baddies;
var move_random = 0;

function create() {
    console.log("create==========>");
    // game.add.sprite(50,50,'dude');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0,'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    var ledge = platforms.create(400,400,'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150,250,'ground');
    ledge.body.immovable = true;
    // ledge.body.collideWorldBounds = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    console.log(player);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10 ,true);
    player.animations.add('right', [5, 6, 7, 8], 10 ,true);

    cursors = game.input.keyboard.createCursorKeys();

    stars = game.add.group();
    stars.enableBody = true;
    for(var i = 0; i < 12; i++){
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 400;
        star.body.bounce.y = 0.5 + Math.random() * 0.2;
    }

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // baddie = game.add.sprite(32, 150, 'baddie');
    baddies = game.add.group();
    baddies.enableBody = true;
    for(var i = 0; i < 5; i++) {
        var baddie = baddies.create(i * 150, 0 , 'baddie' );
        game.physics.arcade.enable(baddie);
        baddie.body.gravity.y = 300;
        baddie.body.bounce.y = 0.1;
        baddie.body.collideWorldBounds = true;
        baddie.animations.add('left', [0, 1], 10 ,true);
        baddie.animations.add('right', [2, 3], 10 ,true);
    }
}   

function update() {
    console.log("update==========>");
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars,platforms);
    game.physics.arcade.collide(baddies,platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, baddies, fight, null, this);

    player.body.velocity.x = 0;
    if(cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if(cursors.right.isDown ) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        player.animations.stop();
        player.frame = 4;
    }

    if(cursors.up.isDown && player.body.touching.down) {
        console.log("up is pressing")
        player.body.velocity.y = -300;
    }

    if(move_random > 50){
        baddies.forEach(function(baddie){
            var num = Math.floor(Math.random() * 10);
            if(num % 2 === 0) {
                baddie.animations.play('left');
                baddie.body.velocity.x = -100;
            } else {
                baddie.animations.play('right');
                baddie.body.velocity.x = 100;
            }
        })
        move_random = 0;  
    }

    move_random++;

    baddies.forEach(function(baddie){
        if(baddie.body.touching.left){
            baddie.animations.play('right');
            baddie.body.velocity.x = 100;
        } else if (baddie.body.touching.right) {
            baddie.animations.play('left');
            baddie.body.velocity.x = -100;
        }
    })

    // baddies.forEach(function(baddie){
    //     // baddie.animations.play('left');
    //     // baddie.animations.play('right');
    //     var baddie_move = setInterval(function(){
    //         baddie
    //     },1000 * 2)
    // })
}

function collectStar(player, star) {
    star.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;
}

function fight(player, baddie) {
    baddie.kill();
}

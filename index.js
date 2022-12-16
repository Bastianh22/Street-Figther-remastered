const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576


c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
});
const shop = new Sprite({
  position: {
    x: 640,
    y: 127
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player1 = new Fighter({
  position: {
    x: 200,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samurai1/idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samurai1/idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samurai1/run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samurai1/jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samurai1/fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samurai1/attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samurai1/takeHit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samurai1/death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
});

const player2 = new Fighter({
  position: {
    x: 800,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/samurai2/idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170
  },
  sprites: {
    idle: {
      imageSrc: './img/samurai2/idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/samurai2/run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samurai2/jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samurai2/fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samurai2/attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/samurai2/takeHit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/samurai2/death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -175,
      y: 50
    },
    width: 175,
    height: 50
  }
});

// console.log(player2);

const keys = {
  q: {
    pressed: false
  },
  d: {
    pressed: false
  },
  z: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}

let lastKey;

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.with >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({ player1, player2 }) {
  clearTimeout(timerId)
  document.querySelector('#timeout').style.display = 'flex'
  if (player1.health === player2.health) {
    document.querySelector('#timeout').innerHTML = 'Time Out'
    player1.game = true
  } else if (player1.health > player2.health) {
    document.querySelector('#timeout').innerHTML = 'Player 1 win'
    player2.game = true
  } else if (player1.health < player2.health) {
    document.querySelector('#timeout').innerHTML = 'Player 2 win'
    player1.game = true
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1500)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({ player1, player2, timerId });
  }
}
decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height)
  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  // controle cadre player1
  if (player1.position.x < 0) {
    player1.position.x = 0;
  } else if (player1.position.x > 970) {
    player1.position.x = 970
  }

  // controle cadre player2
  if (player2.position.x < 10) {
    player2.position.x = 10;
  } else if (player2.position.x > 970) {
    player2.position.x = 970;
  }



  // player1 movement
  player1.switchSprite('idle')
  if (keys.q.pressed && player1.lastKey === 'q') {
    player1.velocity.x = -5
    player1.switchSprite('run')
  } else if (keys.d.pressed && player1.lastKey === 'd') {
    player1.velocity.x = 5
    player1.switchSprite('run')
  } else {
    player1.switchSprite('idle')
  }

  // jump
  if (player1.velocity.y < 0) {
    player1.switchSprite('jump')
  } else if (player1.velocity.y > 0) {
    player1.switchSprite('fall')
  }

  // player2 movement
  player2.switchSprite('idle')
  if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
    player2.velocity.x = -5
    player2.switchSprite('run')
  } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
    player2.velocity.x = 5
    player2.switchSprite('run')
  } else {
    player2.switchSprite('idle')
  }

  // jump
  if (player2.velocity.y < 0) {
    player2.switchSprite('jump')
  } else if (player2.velocity.y > 0) {
    player2.switchSprite('fall')
  }


  // detect collision & hit
  if (rectangularCollision(
    { rectangle1: player1, rectangle2: player2 }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4) {

    player2.takeHit()
    player1.isAttacking = false;

    gsap.to('#player2Health', {
      width: player2.health + '%'
    })
  }

  // 
  if (player1.isAttacking && player1.framesCurrent === 4) {
    player1.isAttacking = false
  }

  // detect collision & hit
  if (rectangularCollision({ rectangle1: player2, rectangle2: player1 }) &&
    player2.isAttacking &&
    player2.framesCurrent === 2) {

    player1.takeHit()
    player2.isAttacking = false;

    gsap.to('#player1Health', {
      width: player1.health + '%'
    })
  }

  // 
  if (player2.isAttacking && player2.framesCurrent === 2) {
    player2.isAttacking = false
  }

  // end game 
  if (player1.health <= 0 || player2.health <= 0) {
    determineWinner({ player1, player2, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {

  if (!player1.dead) {
    switch (event.key) {
      // touche du player1
      case 'd':
        keys.d.pressed = true;
        player1.lastKey = 'd';
        break;
      case 'q':
        keys.q.pressed = true;
        player1.lastKey = 'q';
        break;
      case 'z':
        player1.velocity.y = -20
        break;
      case 's':
        player1.attack()
        break;
    }
  }

  if (!player2.dead) {
    switch (event.key) {
      // touche du player2
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        player2.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        player2.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        player2.velocity.y = -20
        break;
      case 'ArrowDown':
        player2.attack()
        break;
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break;
    case 'q':
      keys.q.pressed = false
      break;
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
  }
})
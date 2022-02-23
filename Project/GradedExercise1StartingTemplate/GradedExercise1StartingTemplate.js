const prompts = require('prompts');

// The classes are located at the bottom of this code.

let space = 1 // I used this space value to determine the current room the player is in.

async function gameLoop() {

  

    const initialActionChoices = [
        { title: 'Look around', value: 'look' },
        { title: 'Go to Room', value: 'goToRoom' },
        { title: 'Attack', value: 'attack'},
        { title: 'Exit game', value: 'exit'}
    ];

    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });

    console.log('You selected ' + response.value);

    // Here I made the moving from room to room logic. 1 = entrance, 2 = hallway, 3 = chamber.
    // I also made sure that the player couldn't just skip the fight and move to the next room. I used the x.xLife for this. I also used it to check if the monster was
    // well, dead.

    if (response.value == "goToRoom" && space == 3 && dragon.dragonLife == "dead") {
      console.log("You move inside the portal at the end of the room. Congratulations, you cleared the Dungeon!")
      console.log("thanks for playing!")
      process.exit();
    }  if (response.value == "goToRoom" && space == 3 && dragon.dragonLife == "alive") {
      console.log("You still need to kill the dragon!");
    }
     if (response.value == "goToRoom" && space == 2 && rat.ratLife == "dead") {
      console.log("You move to the next room...");
      space = space + 1;
      dragon.dragonEnmity = true; //I used this "Enmity" stat to "activate" the fight with the player. This basically check who you are fighting.
    } if (response.value == "goToRoom" && space == 2 && rat.ratLife == "alive"){
      console.log("You still need to kill the Rat!");
    } 
    if (response.value == "goToRoom" && space == 1) {
      console.log("You move to the next room...");
      space = space + 1;
      rat.ratEnmity = true;
    } 
    
    // Creating the look mechanic
    // I added a special description if the player had already beaten the enemy and looked around.

    if (response.value == "look" && space == 1) {
      console.log("You are inside the entrance of the dungeon. The only thing here is a door leading to the next room.");
    }
    if (response.value == "look" && space == 2 && rat.ratLife == "alive") {
      console.log("You are inside the hallway of the dungeon. You see the entrance to the next room, but in front of it sits a rat that jumps towards you!");
    } if ((response.value == "look" && space == 2) && rat.ratLife == "dead") {
      console.log("You are inside the hallway of the dungeon. The slain rat lies at your feet. The entrance is still before you.")
    }
    if (response.value == "look" && space == 3 && dragon.dragonLife == "alive") {
      console.log("You are inside the chamber of the dungeon. In front of you stands a tall dragon, who is now charging at you!");
    } if (response.value == "look" && space == 3 && dragon.dragonLife == "dead") {
      console.log("You are inside the chamber of the dungeon. In front of you stands a portal that is whirling with multiple colours. The motionless dragon lies in front of you")
    }

    // I decided that for the combat I wanted the player to strike before the monter would as it would make the game a bit more fair and more likely to end up in victory.
    // I also added lines like this as a special flavour in case the player wants to attack nothing or a dead target.

    if (response.value == "attack" && space == 2 && rat.ratLife == "dead") { 
      console.log("There is no need to attack the dead rat.")
    }

    if (response.value == "attack" && space == 1) {
      console.log("There is nothing for you to attack here.")
    }

    if (response.value == "attack" && space == 3 && dragon.dragonLife == "dead") {
      console.log("There is no reason to strike the carcass.");
    }

    // Making the combat system against the rat.

    if (response.value == "attack" && rat.ratEnmity == true) {
      player.attack();  
      if (player.playerHit == true) {
          rat.hitpoints = rat.hitpoints - player.damage
          console.log("You hit the rat!")
        } if ( player.playerHit == false) {
      console.log("You miss!");
    }
  
    player.playerTurn = false; // I used the playerTurn to determine when the monster attacks.
  }

    // I moved the "Death check" above the attack so the enemy would not attack with 0 hp

    if (rat.hitpoints <= 0 && rat.ratLife == "alive") {
      console.log("The rat squeaks it's last squeak. You can now safely proceed");
      rat.ratLife = "dead"
      rat.ratEnmity = false;
      player.playerTurn = true;
    }

    if (player.playerTurn == false && rat.ratEnmity == true && rat.ratLife == "alive") {
      rat.bite();
      if (rat.ratHit == true) {
        player.hitpoints = player.hitpoints - rat.damage
        console.log("The rat bites your ankle!")
        console.log("Your current health is " + player.hitpoints);
      }
      if (rat.ratHit == false) {
        console.log("The Rat misses!");
      }
      player.playerTurn = true
    }

    // combat system against the dragon.

    if (response.value == "attack" && dragon.dragonEnmity == true) {
      player.attack();  
      if (player.playerHit == true) {
          dragon.hitpoints = dragon.hitpoints - player.damage
          console.log("You hit the dragon")
        } if ( player.playerHit == false) {
      console.log("You miss!");
    }
  
    player.playerTurn = false;
  }

  if (dragon.hitpoints <= 0 && dragon.dragonLife == "alive") {
    console.log("The dragon roars in pain! It falls motionless at your feet.");
    dragon.dragonLife = "dead";
    dragon.dragonEnmity = false;
    player.playerTurn = true;
  }

  if (player.playerTurn == false && dragon.dragonEnmity == true && dragon.dragonLife == "alive") {
    dragon.fireBreath();
    if (dragon.dragonHit == true) {
      player.hitpoints = player.hitpoints - dragon.damage
      console.log("The dragon breathes fire at you");
      console.log("Your current health is " + player.hitpoints);
    }
    if (dragon.dragonHit == false) {
      console.log("The dragon misses!");
    }
    player.playerTurn = true
  }
  
  // The death trigger at 0 hp.

  if (player.hitpoints <= 0){
    console.log("Your vision goes dark. You have died! Good luck on your next try!");
    process.exit();
  }

  // And if the player wants to exit here's the line.

    if (response.value == "exit") {
      process.exit();
    }

    gameLoop();
  }

process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();
  
//Making the Class for the player and for the mosnters
class Character {
    constructor(hitChance, damage, hitpoints) {
      this.hitChance = hitChance;
      this.damage = damage;
      this.hitpoints = hitpoints;
    }
    getHitChance() { return this.hitChance; }
    
    getDamage() { return this.damage; }
    
    getHitPoints() { return this.hitpoints; }


  }

// What I'm doing next may be a bit wonky. I couldn't figure out how to calculate the attack chance and use it with just the Character class,
// So I decided to make 3 child classes for each character appearing in the game and mark the attack chance there. I used arrays to calculate the chance with 1 being a miss
// I also used the child classes to have Character specific things such as the x.xLife stat.
class Player extends Character {
  constructor(hitChance, damage, hitpoints, playerTurn, playerHit) {
    super(hitChance, damage, hitpoints)

    this.playerTurn = playerTurn;
    this.playerHit = playerHit;

  }

  attack() { let random = Math.floor(Math.random() * player.hitChance.length);
    if (random == 1) {
      player.playerHit = false;
    } else {
      player.playerHit = true;
    }
  }
}

class Rat extends Character {
  constructor (hitChance, damage, hitpoints, ratEnmity, ratLife, ratHit) { // You can see here how I used the class tropes for keeping track of a lot of things above.
    super(hitChance, damage, hitpoints)
    
    this.ratEnmity = ratEnmity;
    this.ratLife = ratLife;
    this.ratHit = ratHit;
    
  }

  bite() { let random = Math.floor(Math.random() * rat.hitChance.length);
    
    if (random == 1) {
      rat.ratHit = false;
    } else {
      rat.ratHit = true;
    }
  }
}

class Dragon extends Character {
  constructor (hitChance, damage, hitpoints, dragonEnmity, dragonLife, dragonHit) {
    super(hitChance, damage, hitpoints)

    this.dragonEnmity = dragonEnmity;
    this.dragonLife = dragonLife;
    this.dragonHit = dragonHit;

  }

  fireBreath() { let random = Math.floor(Math.random() * dragon.hitChance.length);
    if (random == 1) {
      dragon.dragonHit = false;
    } else {
      dragon.dragonHit = true;
    }
  }
}

let player = new Player (["hits", "misses", "hits2", "hits3"], 2, 10, true, false);

let rat = new Rat (["hits", "misses"], 1, 2, false, "alive", false);

let dragon = new Dragon (["h", "m", "h", "h", "h", "h", "h", "h", "h", "h"], 8, 4, false, "alive", false);
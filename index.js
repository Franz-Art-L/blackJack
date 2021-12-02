function dMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

var blackJack = {
  
  //Html ref
  hDealerStand : null, //dealer stand
  hDealerPoints : null, //dealer points
  hDealerHand : null, // dealer hand
  hPlayerStand : null, // player stand
  hPlayerPoints : null, // player points
  hPlayerHand : null, //player hand
  hPlayerControls : null, // player controls
  
  //Game flags
  deck : [] , // the current deck of cards
  dealer : [], // dealer current hand
  player: [], // player current hand
  dealerPoints : 0, // dealer current points
  playerPoints : 0, // tplayer current points
  safety : 17, // computer will stand on or past this point
  dealerStand : false, // dealer stood
  playerStand : false, // player stood
  turn : 0, // check if whos turn already 0 for player, 1 for dealer(computer)
  
  //Initialize game
  init : function () {
    //Get Html Elements
    blackJack.hDealerStand = document.getElementById('dealer-stand');
    blackJack.hDealerPoints = document.getElementById('dealer-points');
    blackJack.hDealerHand = document.getElementById('dcards');
    blackJack.hPlayerStand = document.getElementById('player-stand');
    blackJack.hPlayerPoints = document.getElementById('player-points');
    blackJack.hPlayerHand = document.getElementById('pcards');
    blackJack.hPlayerControls = document.getElementById('playerControl');

    //Attach onclick events
    document.getElementById('playerStart').addEventListener('click', blackJack.start);
    document.getElementById('playerHit').addEventListener('click', blackJack.hit);
    document.getElementById('playerStand').addEventListener('click', blackJack.stand);
  },

  //Start new game
  start : function () {
    //Reset points, hands, deck, turn and html
    blackJack.deck = []; blackJack.dealer = []; blackJack.player = [];
    blackJack.dealerPoints = 0; blackJack.playerPoints = 0;
    blackJack.dealerStand = false; blackJack.playerStand = false;
    blackJack.hDealerPoints.innerHTML = "?"; blackJack.hPlayerPoints.innerHTML = 0;
    blackJack.hDealerHand.innerHTML = ""; blackJack.hPlayerHand.innerHTML = "";
    blackJack.hDealerStand.classList.remove("stood");
    blackJack.hPlayerStand.classList.remove("stood");
    blackJack.hPlayerControls.classList.add("started");

    //Reshuffle deck
    // S: SHAPE (0 = HEART, 1 = DIAMOND, 2 = CLUB, 3 = SPADE)
    // N: NUMBER (1 = ACE, 2 TO 10 = AS-IT-IS, 11 = JACK, 12 = QUEEN, 13 = KING)
    for (let i=0; i<4; i++) { for (let j=1; j<14; j++) {
      blackJack.deck.push({s : i, n : j});
    }}

    // CREDITS:
    // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    for (let i=blackJack.deck.length - 1; i>0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = blackJack.deck[i];
      blackJack.deck[i] = blackJack.deck[j];
      blackJack.deck[j] = temp;
    }

    //Draw first 4 cards
    blackJack.turn = 0; blackJack.draw(); blackJack.turn = 1; blackJack.draw();
    blackJack.turn = 0; blackJack.draw(); blackJack.turn = 1; blackJack.draw();

    //Check who got the black jack card of 21 on first draw
    blackJack.turn = 0; blackJack.points();
    blackJack.turn = 1; blackJack.points();
    var winner = blackJack.check();
    if (winner==null) { 
      blackJack.turn = 0; 
    }
  },

  //Draw a card from the deck
  deckSymbols : [' <span class="redCard">&#9829</span>', ' <span class="redCard">&#9830</span>', ' <span class="bold">&#9827</span>', ' <span class="bold">&#9824</span>'], //Html symbols for cards
  deckNum : { 1: "ACE of", 11 : "JACK of", 12: "QUEEN of", 13 : "KING of" }, // Card numbers

  draw : function () {
    
    //Take last card from deck + create html
    var card = blackJack.deck.pop(),
        cardH = document.createElement('div'),
        cardV = (blackJack.deckNum[card.n] ?  blackJack.deckNum[card.n] : card.n) + blackJack.deckSymbols[card.s];
        cardH.className = "blackJack-card";
        cardH.innerHTML = cardV;

        // Dealer's Card
        // NOTE: Hide first dealer card
        if(blackJack.turn) {
          if(blackJack.dealer.length == 0) {
            cardH.id = "deal-first"
            cardH.innerHTML = `<div class="back">?</div><div class="front">${cardV}</div>`;
          }
          blackJack.dealer.push(card);
            blackJack.hDealerHand.appendChild(cardH);
        }

        // Players Card
        else {
          blackJack.player.push(card);
          blackJack.hPlayerHand.appendChild(cardH);
        }
  },

  //Calculate and update points
  points : function () {
    
    //Run through cards
    // Take cards 1-10 at face value + J, Q, K, At 10 points
    //Don't calculate aces yet, they can either be 1 or 11
    var aces = 0, points = 0;
      for (let i of (blackJack.turn ? blackJack.dealer : blackJack.player)) {
        if(i.n == 1) {
          aces++;
        }
        else if (i.n >= 11 && i.n <= 13) {
          points += 10;
        }
        else {
          points += i.n;
        }
      }
        // Calculations for aces
        //Note for multiple aces, we calculate all possible points and take the highest number
        if (aces!=0) {
          var minmax = [];
          for (let elevens = 0; elevens <= aces; elevens++) {
            let calc = points + (elevens * 11) + (aces - elevens * 1);
            minmax.push(calc);
          }
          points = minmax[0];
          for (let i of minmax) {
            if( i > points && i <= 21 ) {
              points = i;
            }
          }

      }
          //Update points
          if (blackJack.turn) {
            blackJack.dealerPoints = points;
          }
          else {
            blackJack.playerPoints = points;
            blackJack.hPlayerPoints.innerHTML = points;
          }
    
  },

  //Check for winners and losers
  check : function () {
    
    //flags
    //winner - 0 for player, 1 for dealer, 2 for tie
    var winner = null, message = "";

    //check if one or both of the player have Black Jack Cards for the first round:
    if(blackJack.player.length == 2 && blackJack.dealer.length == 2) {
      
      //Tie
      if(blackJack.playerPoints == 21 && blackJack.dealerPoints == 21) {
        winner = 2; message = "Wow It's a tie! you and computer have a black jack cards!😆";
      }

      //Player wins
      if(winner == null && blackJack.playerPoints == 21) {
        winner = 0; message = "CONGRATULATIONS!!!🎆🍾 you just got a BlackJack!!! You Win!!! 🎉🥳";
      }

      //Dealer wins
      if(winner == null && blackJack.dealerPoints == 21) {
        winner = 1; message = "SORRY!!! 😢 The Dealer got a Black Jack, 😭 YOU LOSE!!!! 😿";
      }
    }

    //Who gone bust, which player has more than 21 points in their hand
    if(winner == null) {

      //player bust
      if(blackJack.playerPoints > 21) {
        winner = 1; message = "YOU GOT BUST! 😆 SORRY!! DEALER WINS!!! 🤣";
      }

      //dealer bust 
      if(blackJack.dealerPoints > 21) {
        winner = 0; message = "Hey you got lucky my friend! 😉, Dealer is Bust! YOU WIN!!!🎇🎉🥳";
      }
    }
      // points check when both player stand
      if (winner == null && blackJack.dealerStand && blackJack.playerStand) {
        // DEALER HAS MORE POINTS
        if (blackJack.dealerPoints > blackJack.playerPoints) {
          winner = 1; message = "I'M SORRY MY FRIEND!😢 YOU LOSE!!! 🤣 Dealer wins with " + blackJack.dealerPoints + " points!";
        }
        // PLAYER HAS MORE POINTS
        else if (blackJack.dealerPoints < blackJack.playerPoints) {
          winner = 0; message = "CONGRATULATIONS!🎇🎉🥳  You WON! with " + blackJack.playerPoints + " points!";
        }
        // TIE
        else {
          winner = 2; message = "Oh cmon!!! Its a TIE!!!😕";
        }
      }
    //Check if we already have a winner
    if(winner != null) {

      //show dealer hand and score
      blackJack.hDealerPoints.innerHTML = blackJack.dealerPoints;
      document.getElementById("deal-first").classList.add("show");

      //Reset interface
      blackJack.hPlayerControls.classList.remove("started");

      //and the choosen winner
      alert(message);
    }
      return winner;
  },

  //Hit new card, hit function
  hit : function () {

    //Draw new card
    blackJack.draw(); blackJack.points();

    //auto-stand on 21 points
    if(blackJack.turn == 0 && blackJack.playerPoints == 21 && !blackJack.playerStand) {
      blackJack.playerStand = true; blackJack.hPlayerStand.classList.add('stood');
    }
    if(blackJack.turn == 1 && blackJack.dealerPoints == 21 && !blackJack.dealerStand) {
      blackJack.dealerStand = true; blackJack.hDealerStand.classList.add('stood');
    }

    //Continue if still no winner
    var winner = blackJack.check();
    if(winner == null) {
      blackJack.next();
    }

  },

  //Stand function
  stand : function () {

    //set stand status
    if(blackJack.turn) {
      blackJack.dealerStand = true; blackJack.hDealerStand.classList.add("stood");
    } else {
      blackJack.playerStand = true; blackJack.hPlayerStand.classList.add('stood');
    }

    //Decide to end game or keep going?
    var winner = (blackJack.playerStand && blackJack.dealerStand) ? blackJack.check() : null;
    if(winner == null) {
      blackJack.next();
    }
  },

  //Next function, to determine whats going to happen next
  next : function () {

    //up next...
    blackJack.turn = blackJack.turn == 0 ? 1 : 0;

    //Dealer is next
    if(blackJack.turn == 1) {
      if(blackJack.dealerStand) {
        blackJack.turn = 0;
      } //Skip dealer turn if stood
     else {
      blackJack.aiBotDecision();
    }
  }

  //Player is next
  else {
    if(blackJack.playerStand) {
       blackJack.turn = 1; blackJack.aiBotDecision();
      } //Skip player turn if stood
    }
  },

  //Ai bot function
  aiBotDecision : function () {
    if (blackJack.turn) {
      
      // stand on safety limit
      if(blackJack.dealerPoints >= blackJack.safety) {
         blackJack.stand();
      }

      //or else draw another card
      else {
        blackJack.hit();
        }
      }
    }
  };
window.addEventListener("DOMContentLoaded", blackJack.init);
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
  playerStand : false , // player stood
  turn : 0, // check if whos turn already 0 for player, 1 for dealer(computer)
  
  //Initialize game
  init : function () {
    //Get Html Elements
    blackJack.hDealerHand = document.getElementById('dealer-stand');
    blackJack.hDealerPoints = document.getElementById('dealer-points');
    blackJack.hDealerHand = document.getElementById('dcards');
    blackJack.hPlayerStand = document.getElementById('player-stand');
    blackJack.hPlayerPoints = document.getElementById('player-points');
    blackJack.hPlayerHand = document.getElementById('pcards');
    blackJack.hPlayerControls = document.getElementById('playerControl');

    //Attach onclick events
    document.getElementById('playerStart').addEventListener('click', blackJack.start);
    document.getElementById('playerHit').addEventListener('click', blackJack.hit);
    document.getElementById('playerstand').addEventListener('click', blackJack.stand);
  },

  //Start new game
  start : function () {
    //Reset points, hands, deck, turn and html
    blackJack.deck = []; blackJack.dealer = []; blackJack.player = [];
    blackJack.dealerPoints = 0; blackJack.playerPoints = 0;
    blackJack.dealerStand = false; blackJack.hPlayerStand = false;
    blackJack.hDealerPoints.innerHTML = "?"; blackJack.hPlayerPoints.innerHTML = 0;
    blackJack.hDealerHand.innerHTML = ""; blackJack.hPlayerHand.innerHTML = "";
    blackJack.hDealerStand.classList.remove("stood");
    blackJack.hPlayerStand.classList.remove("stood");
    blackJack.hPlayerControls.classList.add("started");

    //Reshuffle deck
    // S: SHAPE (0 = HEART, 1 = DIAMOND, 2 = CLUB, 3 = SPADE)
    // N: NUMBER (1 = ACE, 2 TO 10 = AS-IT-IS, 11 = JACK, 12 = QUEEN, 13 = KING)
    for (let i=0; i<4; i++) { for (let j=1; j<14; j++) {
      bj.deck.push({s : i, n : j});
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
    blackJack.turn = 1; blackJack.draw(); blackJack.turn = 1; blackJack.draw();

    //Check who got the black jack card of 21 on first draw
    blackJack.turn = 0; blackJack.points();
    blackJack.tuirn = 1; blackJack.points();
    var winner = blackJack.check();
    if (winner==null) { blackJack.turn = 0; }
  },
}
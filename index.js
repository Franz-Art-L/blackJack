function dMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

//Global variable that will hold all of the variables in our blackJack game web app.

var allGlobalVar = {};

//Store important elements in variables to manipulate later.
allGlobalVar.messageBoard = document.getElementById('messageBoard');
allGlobalVar.newGameButton = document.getElementById('newGameButton');
allGlobalVar.phand = document.getElementById('phand');
allGlobalVar.dhand = document.getElementById('dhand');
allGlobalVar.pcards = document.getElementById('pcards');
allGlobalVar.dcards = document.getElementById('dcards');
allGlobalVar.hitButton = document.getElementById('hitButton');
allGlobalVar.standButton = document.getElementById('standButton');
allGlobalVar.yourMoney = document.getElementById('yourMoney');
allGlobalVar.pusta = document.getElementById('pusta');
allGlobalVar.yourScore = document.getElementById('yourScore');
allGlobalVar.dealerScore = document.getElementById('dealerScore');

//Initialize variables to track them
allGlobalVar.phand = [];
allGlobalVar.dhand = [];
allGlobalVar.deck = [];
allGlobalVar.suits = ['clubs <span class="bold">&clubs;', 'diamonds <span class="redcard">&diams;', 'hearts <span class="redcard">&hearts;', 'spades <span class="bold">&spades;'];
allGlobalVar.values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
allGlobalVar.gameStatus = 0; //Flag the game that has not been won.
allGlobalVar.wins = 0; //Flag the game that has not been won.
allGlobalVar.draws = 0; //Flag the game that has not been won.
allGlobalVar.losses = 0; //Flag the game that has not been won.
allGlobalVar.games = 0; //Flag the game that has not been won.

//Object Constructor for a card.
class card {
  constructor(suit, value, name) {
    this.suit = suit; // string of c/d/h/s
    this.value = value; // number 1 - 10
    this.name = name; // string of the full card name
  }
};

var newGame = function () {
  // hide newgame button and show hit/stay buttons
  allGlobalVar.newGameButton.classList.add("hidden");

  //reset text and variables for newgame
  allGlobalVar.dcards.innerHTML = "";
  allGlobalVar.dcards.innerHTML = "";
  allGlobalVar.phand = [];
  allGlobalVar.dhand = [];
  allGlobalVar.gameStatus = 0;

  //New deck is created
  allGlobalVar.deck = createDeck();

  //Deal two cards to both of the player
  allGlobalVar.phand.push(allGlobalVar.deck.pop());
  allGlobalVar.phand.push(allGlobalVar.deck.pop());

  //check if you win that round
  if (handTotal(allGlobalVar.phand) === 21) {
    allGlobalVar.wins += 1;
    allGlobalVar.games += 1;
    allGlobalVar.gameStatus = 1; //for the dealer's hand to drawn face up
    drawHands();
    allGlobalVar.messageBoard.innerHTML = "🎉🎊 CONGRATULATIONS! You Got a BLACKJACK cards, YOU WIN!!🎆🙌";
    track();
    allGlobalVar.gameStatus = 2;
    return;
  }

  //check if computer won that round
  if(handTotal(allGlobalVar.dhand) === 21) {
    allGlobalVar.wins += 1;
    allGlobalVar.games += 1;
    allGlobalVar.gameStatus = 1; //for the dealer's hand to drawn face up
    drawHands();
    allGlobalVar.messageBoard.innerHTML = "😞SORRY! Computer cards got a BLACKJACK! what a LOSER! 🤣";
    track();
    allGlobalVar.gameStatus = 2;
    return;
  }

  //Draw both of the hands if neither of them won on the initial deal
  drawHands();
  allGlobalVar.messageBoard.innerHTML = "The initial hands are dealt";
};

/* up to here for now, to be continued tomorroww.

 var createDeck = function () {
  var deck [];
  //loop the deck suits and values, building cards and adding them to the deck.
  for(var a = 0; a < allGlobalVar.suits.length; a++) {
    for(var b = 0; b < allGlobalVar.values.length; b++) {
      var cardValue = b + 1;
        var cardTitle = "";
          if(cardValue > 10) {
            cardValue = 10;
          }
          if (cardValue != 1) {
            cardTitle += (allGlobalVar.values(b) + "of" + allGlobalVar.suits[a] + " (" + cardValue + ")");
          }
          else {
            cardTitle += (allGlobalVar[b] + " of " + allGlobalVar.suits[a] + " (" + cardValue + " or 11)");
          }
    }
  }

}
*/

























/*
var numOfCardsRelease = 0;

var player = {

  cards: [],
  score: 0,
  moneyInHand: 1000

};

var dealer = {

  cards: [],
  score: 0

}

document.getElementById("yourMoney").innerHTML = "Money in your pocket: $" + player.moneyInHand;

document.getElementById("hitButton").disabled = true;

document.getElementById("standButton").disabled = true;

function cardsValue(c) {
  
  var cardArray = [];

    sum = 0;
      i = 0;
        aceCount = 0;

  cardArray = c;

  for (i; i < cardArray.length; i += 1) {
    if(cardArray[i].rank === "JACK" || cardArray[i].rank === "QUEEN" || cardArray[i].rank === "KING") {
      sum += 10;  
    } else if (cardArray[i].rank = "ACE") {
      sum += 11;
       aceCount += 1;
    } else {
      sum += cardArray[i].rank;
    }
  }
    while (aceCount > 0 && sum > 21) {
      sum -= 10;
        aceCount -= 1;
    }
    return sum;
}


var deck = {

  deckArray: [],

  initialize: function () {
      var typeArray, rankArray, t, r;
        typeArray = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];
          rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "ACE", "JACK", "QUEEN", "KING"];
            for (t = 0; t < typeArray.length; t += 1) {
              for (r = 0; r < rankArray.length; r += 1) {
                this.deckArray[t * 13 + r] = {
                  rank: rankArray[r],
                    type: typeArray[t] 
                };
              }
            }
  },

  shuffle: function () {
    var temp, i, random;
      for(i = 0; i < this.deckArray.length; i += 1) {
        random = Math.floor(Math.random() * this.deckArray.length);
          temp = this.deckArray[i];
            this.deckArray[i] = this.deckArray[random];
              this.deckArray[random] = temp;
      }
  }
};


deck.initialize();
deck.shuffle();


function bet(outcome) {
  var playerPusta = document.getElementById("pusta").valueAsNumber;
  if(outcome === "win") {
    player.moneyInHand += playerPusta;
  }
  if(outcome === "lost") {
    player.moneyInHand -= playerPusta;
  }
}


function resetGame() {
  
  numOfCardsRelease = 0;
  player.cards = [];
  dealer.cards = [];
  player.score = 0;
  dealer.score = 0;
  deck.initialize();
  deck.shuffle();
  document.getElementById('hitButton').disabled = true;
  document.getElementById('standButton').disabled = true;
  document.getElementById('newGameButton').disabled = false;

}


function endGame() {
  if (player.score === 21) {
    
    document.getElementById("messageBoard").innerHTML = "🎉🎊 CONGRATULATIONS! You Got a BLACKJACK cards, YOU WIN!!🎆🙌" + "<br>" + "click New Game if you want to play again.";

    bet("win");

    document.getElementById('yourMoney').innerHTML = "Your money: $" + player.moneyInHand;
    
    resetGame();
  }

  if (player.score > 21) {
    document.getElementById("messageBoard").innerHTML = "😞SORRY Your cards is more than 21, better luck next time LOSER! 🤣" + "<br>" + "click New Game  if you want to play again";

    bet("lose");

    document.getElementById("yourMoney").innerHTML = "Your money: $" + player.moneyInHand;

    resetGame();
  }

  if (dealer.score === 21) {
    document.getElementById("messageBoard").innerHTML = "😞SORRY! Computer cards got a BLACKJACK! what a LOSER! 🤣" + "<br>" + "click New Game  if you want to play again";

    bet("lose");

    document.getElementById("yourMoney").innerHTML = "Your money: $" + player.moneyInHand;

    resetGame();
  }

  if (dealer.score > 21) {
    document.getElementById("messageBoard").innerHTML = "🎉🎊 CONGRATULATIONS! Computer cards is more than 21, you got lucky!!! HAHA 🤣" + "<br>" + "click New Game  if you want to play again";

    bet("win");

    document.getElementById("yourMoney").innerHTML = "Your money: $" + player.moneyInHand;

    resetGame();
  }

  if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
    document.getElementById("messageBoard").innerHTML = "🎉🎊 CONGRATULATIONS! Your card is higher than the dealer, you got lucky again!!! HAHA 🤣" + "<br>" + "click New Game  if you want to play again";

    bet("win");

    document.getElementById("yourMoney").innerHTML = "Your money: $" + player.moneyInHand;

    resetGame();
  }

  if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
    document.getElementById("messageBoard").innerHTML = "😞SORRY!! Computer cards is higher than yours!! you're such a LOSER! HAHAHA🤣" + "<br>" + "click New Game  if you want to play again";

    bet("lose");

    document.getElementById("yourMoney").innerHTML = "Your money: $" + player.moneyInHand;

    resetGame();
  }

  if (dealer.score >= 17 && player.score === dealer.score && player.score < 21) {
    document.getElementById("messageBoard").innerHTML = "🧑‍🎤Yow! It's a TIE!!! No one wins and no one losses! It's a PUSH!!!🤝 " + "<br>" + "click New Game  if you want to play again";

    resetGame();
  }

  if (player.moneyInHand === 0) {
    document.getElementById("newGameButton").disabled = true;
    document.getElementById("hitButton").disabled = true;
    document.getElementById("standButton").disabled = true;
    document.getElementById("messageBoard").innerHTML = "HUHU I'm very sorry my friend😭" + "<br>" + "You ran out of Money!!! HAHAHA 😆🤣 just click the new game if you still want to play and lose again. HAHAHA 😆🤣 PEACE y'all!!! 🥰";
  }

}


function dealerDraw() {

  dealer.cards.push(deck.deckArray)
  dealer.score = cardsValue(dealer.cards);
  document.getElementById("dealerCards").innerHTML = "Dealer Cards: " + JSON.stringify(dealer.cards);
  document.getElementById("dealerScore").innerHTML = "Dealer Score: " + dealer.score;
  numOfCardsRelease += 1;

}

function newGame() {
  
  document.getElementById("newGameButton").disabled = true;
  document.getElementById("hitButton").disabled = false;
  document.getElementById("standButton").disabled = false;
  document.getElementById("message-board").innerHTML = "";
  hit();
  hit();
  dealerDraw();
  endGame();

}

function hit() {
  
  player.cards.push(deck.deckArray[numOfCardsRelease]);
  player.score = cardsValue(palyer.cards);
  document.getElementById("yourCards").innerHTML = "Your cards: " + JSON.stringify(player.cards);
  document.getElementById("yourScore").innerHTML = "Your score: " + player.score;
  numOfCardsRelease += 1;

  if(numOfCardsRelease > 2) {
    endGame();
  }

}

function stand() {

  while (dealer.score < 17) {
    dealerDraw();
  }
  endGame();

}
*/

function dMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

var allGlobalVar = {};

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



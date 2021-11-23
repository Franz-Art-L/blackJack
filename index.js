function dMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

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
  var playerPusta = document.getElementById('pusta').valueAsNumber;
  if(outcome === "win") {
    player.moneyInHand += playerPusta;
  } else {
    player.moneyInHand += playerPusta;
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

/*function endGame() {
  if(player.score === 21) {
    document.getElementById()
  }
}
//To be continued its already late, time to push this one.
*/
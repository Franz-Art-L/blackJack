function dMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

//Global variable that will hold all of the variables in our blackJack game web app.

var allGlobalVar = {};

// Store important elements in variables for later manipulation
allGlobalVar.pcards = document.getElementById('pcards');
allGlobalVar.dcards = document.getElementById('dcards');
allGlobalVar.hitButton = document.getElementById('hit');
allGlobalVar.stayButton = document.getElementById('stay');
allGlobalVar.playButton = document.getElementById('play');
allGlobalVar.messageBoard = document.getElementById('messageBoard');
allGlobalVar.buttonBox = document.getElementById('buttonBox');
allGlobalVar.phandtext = document.getElementById('phand');
allGlobalVar.dhandtext = document.getElementById('dhand');
allGlobalVar.tracker = document.getElementById('tracker');
allGlobalVar.newGameButton = document.getElementById('newGameButton');
allGlobalVar.choice = document.getElementById('choice');

// initialize variables to track hands/cards/etc.
allGlobalVar.playerHand = [];
allGlobalVar.dealerHand = [];
allGlobalVar.deck = [];
allGlobalVar.suits = ['clubs <span class="bold">&#9827</span>', 'diamonds <span class="redcard">&#9830</span>', 'hearts <span class="redcard">&#9829</span>', 'spades <span class="bold">&#9824</span>'];
allGlobalVar.values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
allGlobalVar.gameStatus = 0; // flag that game has not yet been won
allGlobalVar.wins = 0; // flag that game has not yet been won
allGlobalVar.draws = 0; // flag that game has not yet been won
allGlobalVar.losses = 0; // flag that game has not yet been won
allGlobalVar.games = 0; // flag that game has not yet been won

// Object Constructor for a card. !!! ALWAYS USE NEW WHEN MAKING A NEW CARD!!!
function card(suit, value, name) {
    this.suit = suit; // string of c/d/h/s
    this.value = value; // number 1 - 10
    this.name = name; // string of the full card name
};


var newGame = function () {
    // remove newGameButton button and show hit/stay buttons
    allGlobalVar.newGameButton.classList.add("hidden");
    
    // reset text and variables for newGameButton
    allGlobalVar.dcards.innerHTML = "";
    allGlobalVar.dcards.innerHTML = "";
    allGlobalVar.playerHand = [];
    allGlobalVar.dealerHand = [];
    allGlobalVar.gameStatus = 0;

    // Create the new deck
    allGlobalVar.deck = createDeck();

    // Deal two cards to the player and two cards to the dealer
    allGlobalVar.playerHand.push(allGlobalVar.deck.pop());
    allGlobalVar.playerHand.push(allGlobalVar.deck.pop());

    // check for player victory
    if (handTotal(allGlobalVar.playerHand) === 21)
    {
        allGlobalVar.wins += 1;
        allGlobalVar.games += 1;        
        allGlobalVar.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        allGlobalVar.messageBoard.innerHTML = "You won! You got 21 on your initial hand!";
        track();
        allGlobalVar.gameStatus = 2; // game is won
        return;
    }

    allGlobalVar.dealerHand.push(allGlobalVar.deck.pop());
    allGlobalVar.dealerHand.push(allGlobalVar.deck.pop());

    // check for dealer victory    
    if (handTotal(allGlobalVar.dealerHand) === 21)
    {
        allGlobalVar.games += 1;
        allGlobalVar.losses += 1;
        allGlobalVar.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        allGlobalVar.messageBoard.innerHTML = "You lost! The dealer had 21 on their initial hand.";
        track();
        allGlobalVar.gameStatus = 2; // game is won
        return;
    }

    // draw the hands if neither won on the initial deal
    drawHands();
    advise();
    allGlobalVar.buttonBox.classList.remove("hidden"); // show hit/stay buttons
    allGlobalVar.messageBoard.innerHTML = "The initial hands are dealt!";
    
};

var createDeck = function () {
    var deck = [];
    // loop through suits and values, building cards and adding them to the deck as you go
    for (var a = 0; a < allGlobalVar.suits.length; a++) {
        for (var b = 0; b < allGlobalVar.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";            
            if (cardValue > 10){
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (allGlobalVar.values[b] + " of " + allGlobalVar.suits[a] + " (" + cardValue + ")");
            }
            else
            {
                cardTitle += (allGlobalVar.values[b] + " of " + allGlobalVar.suits[a] + " (" + cardValue + " or 11)");
            }
            var newCard = new card(allGlobalVar.suits[a], cardValue, cardTitle);
            deck.push(newCard);
            

        }
    }
    //console.log("Deck created! Deck size: " + deck.length)
    deck = shuffle(deck);
    //console.log("Deck shuffeled! Deck size: " + deck.length)
    //deckPrinter(deck);
    return deck;
};

// Update the screen with the contents of the player and dealer hands
var drawHands = function () {    
    var htmlswap = "";
    var ptotal = handTotal(allGlobalVar.playerHand);
    var dtotal = handTotal(allGlobalVar.dealerHand);
    htmlswap += "<ul>";
    for (var i = 0; i < allGlobalVar.playerHand.length; i++)
    {
        htmlswap += "<li>" + allGlobalVar.playerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    allGlobalVar.pcards.innerHTML = htmlswap;
    allGlobalVar.phandtext.innerHTML = "Your Hand (" + ptotal + ")"; // update player hand total
    if (allGlobalVar.dealerHand.length == 0)
    {
        return;
    }

    // clear the html string, re-do for the dealer, depending on if stay has been pressed or not
    htmlswap = "";
    if (allGlobalVar.gameStatus === 0)
    {
        htmlswap += "<ul><li>[Hidden Card]</li>";
        allGlobalVar.dhandtext.innerHTML = "Dealer's Hand (" + allGlobalVar.dealerHand[1].value + " + hidden card)"; // hide value while a card is face down
    }
    else
    {
        allGlobalVar.dhandtext.innerHTML = "Dealer's Hand (" + dtotal + ")"; // update dealer hand total
    }
    
    for (var i = 0; i < allGlobalVar.dealerHand.length; i++) {
        // if the dealer hasn't had any new cards, don't display their face-down card
        // skip their first card, which will be displayed as hidden card
        // per the above if statement
        if (allGlobalVar.gameStatus === 0)
        {
            i += 1;
        }
        htmlswap += "<li>" + allGlobalVar.dealerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    allGlobalVar.dcards.innerHTML = htmlswap;
    //console.log("Player has " + allGlobalVar.playerHand.length + " cards, dealer has " + allGlobalVar.dealerHand.length + " cards, and deck has " + allGlobalVar.deck.length + " cards.");

};

// return the total value of the hand 
var handTotal = function (hand) {
    //console.log("Checking hand value");
    var total = 0;
    var aceFlag = 0; // track the number of aces in the hand
    for (var i = 0; i < hand.length; i++) {
        //console.log("Card: " + hand[i].name);
        total += hand[i].value;
        if (hand[i].value == 1)
        {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if doing so won't cause a bust
    // To show best-possible hand value
    for (var j = 0; j < aceFlag; j++)
    {
        if (total + 10 <= 21)
        {
            total +=10;
        }
    }
    // console.log("Total: " + total);
    return total;
}

// Shuffle the new deck
var shuffle = function (deck) {
    // console.log("Begin shuffle...");
    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++)
    {
        var randomCard = getRandomInt(0, (deck.length));        
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);        
    }
    return shuffledDeck;
}

var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // console.log("Min: " + min + " Max: " + max);
    return Math.floor(Math.random() * (max - min)) + min;
    // code based on sample from MDN
}

// print the deck to the console 
// only for for debugging purposes
var deckPrinter = function (deck) {
    for (var i = 0; i < deck.length; i++)
    {
        console.log(deck[i].name);
    }
    return
}

// Game loop begins when the play button is pressed
allGlobalVar.playButton.addEventListener("click", newGame);

// Hit button pressed:
allGlobalVar.hitButton.addEventListener("click", function () {
    // disable if the game has already been won
    if (allGlobalVar.gameStatus === 2)
    {
        console.log("Hit clicked when game was over or already clicked.");
        return;
    }

    // deal a card to the player and draw the hands
    allGlobalVar.playerHand.push(allGlobalVar.deck.pop());
    drawHands();
   

    var handVal = handTotal(allGlobalVar.playerHand);
    if (handVal > 21)
    {
        bust();
        advise();
        return;
    }
    else if (handVal === 21)
    {
        victory();
        advise();
        return;
    }
    advise();
    allGlobalVar.messageBoard.innerHTML = "Hit or stay?</p>";
    return;      
});

// Stay button pressed:
allGlobalVar.stayButton.addEventListener("click", function stayLoop() {
    //console.log("(1)Inside stayLoop now");
    // disable ig game already won
    if (allGlobalVar.gameStatus === 2)
    {
        console.log("Stay clicked when game was over or already clicked.");
        return;
    }
    else if (allGlobalVar.gameStatus === 0) // i.e. stay was just pressed
    {
        
        allGlobalVar.buttonBox.classList.add("hidden"); // take away the hit and stay buttons
        var handVal = handTotal(allGlobalVar.dealerHand);
        allGlobalVar.gameStatus = 1; // enter the 'stay' loop
        advise(); // clear advise
        allGlobalVar.messageBoard.innerHTML = "The dealer reveals their hidden card";
        drawHands();
        setTimeout(stayLoop, 750); // return to the stay loop
    }
    else if (allGlobalVar.gameStatus === 1) {    

    // If dealer has less than 17, hit
    var handVal = handTotal(allGlobalVar.dealerHand);
    if (handVal > 16 && handVal <= 21) // dealer stays and game resolves
    {
        drawHands();
        //console.log("----------Dealer stays, checking hands");
        var playerVal = handTotal(allGlobalVar.playerHand);
        if (playerVal > handVal)
        {            
            victory();
            return;
        }
        else if (playerVal < handVal)
        {            
            bust();
            return;
        }
        else
        {            
            tie();
            return;
        }
    }
    if (handVal > 21)
    {
        victory();
        return;
    }
    else // hit
    {
        allGlobalVar.messageBoard.innerHTML = "Dealer hits!";
        allGlobalVar.dealerHand.push(allGlobalVar.deck.pop());
        drawHands();
        setTimeout(stayLoop, 750);
        return;
    }   
    }
});

var victory = function () {
    allGlobalVar.wins += 1;
    allGlobalVar.games += 1;
    var explanation = "";
    allGlobalVar.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(allGlobalVar.playerHand);
    var dealerTotal = handTotal(allGlobalVar.dealerHand);
    if (playerTotal === 21)
    {
        explanation = "Your hand's value is 21!";
    }
    else if (dealerTotal > 21)
    {
        explanation = "Dealer busted with " + dealerTotal + "!";
    }
    else
    {
        explanation = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    allGlobalVar.messageBoard.innerHTML = "You won!<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var bust = function () {
    allGlobalVar.games += 1;
    allGlobalVar.losses += 1;
    var explanation = "";
    allGlobalVar.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(allGlobalVar.playerHand);
    var dealerTotal = handTotal(allGlobalVar.dealerHand);
    if (playerTotal > 21)
    {
        explanation = "You busted with " + playerTotal + ".";
    }
    allGlobalVar.messageBoard.innerHTML = "You lost.<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var tie = function () {    
    allGlobalVar.games += 1;
    allGlobalVar.draws += 1;
    var explanation = "";
    allGlobalVar.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(allGlobalVar.playerHand);
    allGlobalVar.messageBoard.innerHTML = "It's a tie at " + playerTotal + " points each.<br>Press 'New Game' to play again.";
    track();
}

// update the win/loss counter
var track = function () {
    allGlobalVar.tracker.innerHTML = "<p>Wins: " + allGlobalVar.wins + " Draws: " + allGlobalVar.draws + " Losses: " + allGlobalVar.losses + "</p>";
    allGlobalVar.newGameButton.classList.remove("hidden");
    allGlobalVar.buttonBox.classList.add("hidden");
}

// check the player hand for an ace
var softCheck = function (hand) {    
    var total = 0;
    var aceFlag = 0; // track the number of aces in the hand
    for (var i = 0; i < hand.length; i++) {
        //console.log("Card: " + hand[i].name);
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if doing so won't cause a bust
    // To show best-possible hand value
    for (var j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            return true; // the hand is soft, i.e. it can be multiple values because of aces
        }
    }    
    return false; // the hand is hard, i.e. it has only one possible value
}

var advise = function () {
    // no advise if player has no choices
    if (allGlobalVar.gameStatus > 0)
    {
        allGlobalVar.choice.innerHTML = "";
        return;
    } 
    var playerTotal = handTotal(allGlobalVar.playerHand);
    var soft = softCheck(allGlobalVar.playerHand);
    console.log("Soft: " + soft);
    var dealerUp = allGlobalVar.dealerHand[1].value;
    // count dealer's ace as 11 to simplify logic
    if (dealerUp === 1)
    {
        dealerUp = 11;
    }

    // provide advice based on HIGHLY simplified blackjack basic strategy
    if (playerTotal <= 11 && !soft)
    {
        allGlobalVar.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp <= 6 && !soft)
    {
        allGlobalVar.choice.innerHTML = "[Stay]";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp >= 7 && !soft)
    {
        allGlobalVar.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 17 && playerTotal <= 21 && !soft)
    {
        allGlobalVar.choice.innerHTML = "[Stay]";
    }
    else if (playerTotal >= 12 && playerTotal <= 18 && soft)
    {
        allGlobalVar.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 19 && playerTotal <= 21 && soft)
    {
        allGlobalVar.choice.innerHTML = "[Stay]";
    }
    else
    {
        allGlobalVar.choice.innerHTML = "Massive error, unexpected scenario, idk";
        console.log("Error: Player's hand was " + playerTotal + " and dealer's faceup was " + dealerUp + ".");
    }
    return;
}























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

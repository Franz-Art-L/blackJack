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

deck.initialize();
deck.shuffle();
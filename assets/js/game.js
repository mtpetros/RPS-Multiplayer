//Initialize Firebase
var config = {
  apiKey: "AIzaSyAHYXwiZOE2Qxtd3xG8P8ouFOVHqCU8JKQ",
  authDomain: "rps-multiplayer-169dc.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-169dc.firebaseio.com",
  storageBucket: "rps-multiplayer-169dc.appspot.com",
  messagingSenderId: "241897385642"
};

firebase.initializeApp(config);

//variable that references the database
var database = firebase.database();
var ref = database.ref();

var sUser1;
var sUser2;
var state;

ref.on("child_added", function(snapshot) {//This function retrieves data from firebase upon loading the html.
  if (snapshot.child("user1").exists()) {
    sUser1 = snapshot.val().user1;
    $(".user1-choice").html("?");
    $(".instructions").html("Player 2's Turn!")
    state = "ready";
  }
});

var game = {

  user1: {
    client: function() {//This function organizes and calls the other user1. functions.
      if (sUser1 === "rock" || sUser1 === "paper" || sUser1 === "scissors") {
        game.user2.client();
      } else {
        $(".element-box").on("click.user1", function() {
          $(".element-box").off("click.user1");  
          game.user1.clientChoice = $(this).data().element;
          console.log("user1 " + game.user1.clientChoice);
          game.user1.set();
          game.user1.server();
          ref.once("child_added").then(game.user2.client);
        });
        
      }
    },

    clientChoice: null,

    set: function() {//This function sets user1's choice in firebase
      ref.push({
        user1: game.user1.clientChoice
      });
    },

    server: function() {//This function retrieves user1's choice from firebase
      ref.once("child_added").then(function(snapshot) {
        sUser1 = snapshot.val().user1;
      });
    },

    wins: 0,

    losses: 0    
   },

  user2: {
    client: function() {//This function organizes and calls the other user2. functions.
        $(".element-box").on("click.user2", function() {
          $(".element-box").off("click.user2");
          game.user2.clientChoice = $(this).data().element;
          console.log("user2 " + game.user2.clientChoice);
          game.user2.set();
          game.user2.server();
          ref.once("child_added").then(game.logic);
          });      
    },

    clientChoice: null,

    set: function() {//This function sets user2's choice in firebase
      ref.push({
        user2: game.user2.clientChoice
      });
    },

    server: function() {//This function retrieves user2's choice from firebase
      ref.on("child_added", function(snapshot) {
        sUser2 = snapshot.val().user2;
      });
    },

    wins: 0,

    losses: 0  
   },

  logic: function() {//This function contains the game logic
    if (sUser1 === "rock") {
      if (sUser2 === "rock") {
        console.log("draw!");
        $(".winner").html('<p>draw</p>').append('<button type="button" id="reset">Play Again!</button>');
      } else if (sUser2 === "paper") {
        console.log("user2 wins!");
        game.user2.wins++;
        $('#player2-wins').html(game.user2.wins);
        game.user1.losses++;
        $('#player1-losses').html(game.user1.losses);
        $(".winner").html('<p>player 2 wins!</p>').append('<button type="button" id="reset">Play Again!</button>');
      } else {
        console.log("user1 wins!");
        game.user1.wins++;
        $('#player1-wins').html(game.user1.wins);
        game.user2.losses++;
        $('#player2-losses').html(game.user2.losses);
        $(".winner").html('<p>player 1 wins!</p>').append('<button type="button" id="reset">Play Again!</button>');
      }
    } else if (sUser1 === "paper") {
      if (sUser2 === "rock") {
        console.log("user1 wins!");
        game.user1.wins++;
        $('#player1-wins').html(game.user1.wins);
        game.user2.losses++;
        $('#player2-losses').html(game.user2.losses);
        $(".winner").html('<p>player 1 wins!</p>').append('<button type="button" id="reset">Play Again!</button>');
      } else if (sUser2 === "paper") {
        console.log("draw");
        $(".winner").html('<p>draw</p>').append('<button type="button" id="reset">Play Again!</button>');
      } else {
        console.log("user2 wins!");
        game.user2.wins++;
        $('#player2-wins').html(game.user2.wins);
        game.user1.losses++;
        $('#player1-losses').html(game.user1.losses);
        $(".winner").html('<p>player 2 wins!</p>').append('<button type="button" id="reset">Play Again!</button>');
      }
    } else {
      if (sUser2 === "rock") {
        console.log("user2 wins!");
        game.user2.wins++;
        $('#player2-wins').html(game.user2.wins);
        game.user1.losses++;
        $('#player1-losses').html(game.user1.losses);
        $(".winner").html('<p>player 2 wins!</p>').append('<button type="button" id="reset">Play Again!</button>');
      } else if (sUser2 === "paper") {
        console.log("user1 wins!");
        game.user1.wins++;
        $('#player1-wins').html(game.user1.wins);
        game.user2.losses++;
        $('#player2-losses').html(game.user2.losses);
        $(".winner").html('<p>player 1 wins!</p>').append('<button type="button" id="reset">Play Again!</button>');
      } else {
        console.log("draw");
        $(".winner").html('<p>draw</p>').append('<button type="button" id="reset">Play Again!</button>');
      }
    }
  },

  player1Chat: function() {//This function controls player 1 chat
    $('#player1-submit').on('click', function() {
      var chatText = $('#player1-chat').val().trim();
      $('#chat-box').append('<p>player 1: ' + chatText + '</p>');
      return false;
    });
  },

  player2Chat: function() {//This function controls player 2 chat
    $('#player2-submit').on('click', function() {
      var chatText = $('#player2-chat').val().trim();
      $('#chat-box').append('<p>player 2: ' + chatText + '</p>');
      return false;
    });
  },

  reset: function() {//This resets the game
    ref.remove();
    sUser1 = undefined;
    sUser2 = undefined;
    state = undefined;
    $('.instructions').html("");
    $('.winner').html("");
    $('.user1-choice').html("Rock, Paper, or Scissors?");
    game.user1.clientChoice = null;
    game.user2.clientChoice = null;
    game.user1.client();
  },

  waitForServer: function() {//This forces the game to await a response from firebase before deciding whether or not to allow user2 to choose
      if (state === "ready") {
      game.user2.client();
    } else {
      game.user1.client();
    }
  }
};

setTimeout(game.waitForServer, 1000);
game.player1Chat();
game.player2Chat();
$('.winner').on('click', '#reset', game.reset);








      


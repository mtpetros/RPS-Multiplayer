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

var sUser1 = null;
var sUser2 = null;
var game = {
  user1: {
    client: prompt("Rock, Paper, or Scissors?"),
    server: function() {
      ref.once("value")
      .then(function(snapshot) {
        sUser1 = snapshot.val().user1;
      });      
    }
  },

  user2: {
    client: prompt("Rock, Paper, or Scissors?"),
    server: function() {
      ref.once("value")
      .then(function(snapshot) {
        sUser2 = snapshot.val().user2;
      });      
    }
  },

 /// get: function(u) {
 ///     ref.once("value")
 ///     .then(function(snapshot) {
 ///       snapshot.val().u;
 ///     });      
 /// },

  userSet: function() {
    ref.set({
      user1: game.user1.client,
      user2: game.user2.client
    });
  },//need to do these individually and use .update!!!

  logic: function() {
    if (sUser1 === "rock") {
      if (sUser2 === "rock") {
        console.log("draw!");
      } else if (sUser2 === "paper") {
        console.log("user2 wins!");
      } else {
        console.log("user1 wins!");
      }
    } else if (sUser1 === "paper") {
      if (sUser2 === "rock") {
        console.log("user1 wins!");
      } else if (sUser2 === "paper") {
        console.log("draw");
      } else {
        console.log("user2 wins!");
      }
    } else {
      if (sUser2 === "rock") {
        console.log("user2 wins!");
      } else if (sUser2 === "paper") {
        console.log("user1 wins!");
      } else {
        console.log("draw");
      }
    }
  },

  color: "red"
}; 

game.userSet();
game.user1.server();
game.user2.server();
ref.once("value").then(game.logic);
      


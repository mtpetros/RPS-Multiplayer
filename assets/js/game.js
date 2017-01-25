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

ref.on("child_added", function(snapshot) {
  if (snapshot.child("user1").exists()) {
    sUser1 = snapshot.val().user1;
    $(".user1-choice").html("?");
    $(".instructions").html("Player 2's Turn!")
    state = "ready";
  }
});



// ref.once("value")
//   .then(function(snapshot) {
//     if (snapshot.child("user1").exists()) {
//       sUser1 = snapshot.val().user1;
//       game.user2.client();
//     } else {
//       game.user1.client();
//     }
//   });

var game = {

  user1: {
    client: function() {
      if (sUser1 === "rock" || sUser1 === "paper" || sUser1 === "scissors") {
        game.user2.client();
      } else {
        $(".element-box").on("click.user1", function() {
          $(".element-box").off("click.user1");  
          game.user1.client = $(this).data().element;
          console.log("user1 " + game.user1.client);
          game.user1.set();
          game.user1.server();
          ref.once("child_added").then(game.user2.client);
        });
        
      }
    },

    set: function() {
      ref.push({
        user1: game.user1.client
      });
    },

    server: function() {
      ref.once("child_added").then(function(snapshot) {
        sUser1 = snapshot.val().user1;
      });
    }    
   },

  user2: {
    client: function() {
        $(".element-box").on("click.user2", function() {
          $(".element-box").off("click.user2");
          game.user2.client = $(this).data().element;
          console.log("user2 " + game.user2.client);
          game.user2.set();
          game.user2.server();
          ref.once("child_added").then(game.logic);
          });      
    },

    set: function() {
      ref.push({
        user2: game.user2.client
      });
    },

    server: function() {
      ref.on("child_added", function(snapshot) {
        sUser2 = snapshot.val().user2;
      });
    }
   },

  // listener: function() {
  //   ref.on("child_added", function(snapshot) {
  //     sUser1 = snapshot.val().user1;
  //     sUser2 = snapshot.val().user2;
  //   });
  // },

 /// get: function(u) {
 ///     ref.once("value")
 ///     .then(function(snapshot) {
 ///       snapshot.val().u;
 ///     });      
 /// },

 /// userSet: function() {
 ///   ref.set({
 ///     user1: game.user1.client,
 ///     user2: game.user2.client
 ///   });
 // },//need to do these individually and use .update!!!

  logic: function() {
    if (sUser1 === "rock") {
      if (sUser2 === "rock") {
        console.log("draw!");
        $(".winner").html('<p>draw</p>');
      } else if (sUser2 === "paper") {
        console.log("user2 wins!");
        $(".winner").html('<p>player 2 wins!</p>');
      } else {
        console.log("user1 wins!");
        $(".winner").html('<p>player 1 wins!</p>');
      }
    } else if (sUser1 === "paper") {
      if (sUser2 === "rock") {
        console.log("user1 wins!");
        $(".winner").html('<p>player 1 wins!</p>');
      } else if (sUser2 === "paper") {
        console.log("draw");
        $(".winner").html('<p>draw</p>');
      } else {
        console.log("user2 wins!");
        $(".winner").html('<p>player 2 wins!</p>');
      }
    } else {
      if (sUser2 === "rock") {
        console.log("user2 wins!");
        $(".winner").html('<p>player 2 wins!</p>');
      } else if (sUser2 === "paper") {
        console.log("user1 wins!");
        $(".winner").html('<p>player 1 wins!</p>');
      } else {
        console.log("draw");
        $(".winner").html('<p>draw</p>');
      }
    }
  },

  reset: function() {
    ref.remove();
    sUser1 = undefined;
    sUser2 = undefined;
    $('.instructions').html("");
    $('.user1-choice').html("Rock, Paper, or Scissors?");
    game.user1.client();
  },

  waitForServer: function() {
      if (state === "ready") {
      game.user2.client();
    } else {
      game.user1.client();
    }
  }
};

setTimeout(game.waitForServer, 1000);
//$('#reset').on('click', game.reset);








//ref.once("child_added").then(game.logic);
      


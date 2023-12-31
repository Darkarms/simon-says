//create simon game
//create game objects
//sequence storage
let sequence = [];
let sequenceGuessStep = 0;
let gameOver = true;
let score = 0;
let volume = 0.5;
let audio = new Audio("./sounds/blue.mp3");

//create function for next sequence
function generateNextSequence() { 
  var nextSequence = Math.floor(Math.random() * 4) + 1;
  sequence.push(nextSequence);
}

//create function to convert numbered selection to element ID
function getSelectionID(ID) { 
  var selectionID = "";
  switch(ID) { 
    case 1:
      selectionID = "green";
      break;
    case 2: 
      selectionID = "red";
      break;
    case 3:
      selectionID = "yellow";
      break;
    case 4:
      selectionID = "blue";
      break;
    default:
      selectionID = "";
  }
  return selectionID;
}

//create function to animate sequence
function animateSequence() { 
  for(let i = 0; i < sequence.length; i++) { 
    let selection = getSelectionID(sequence[i]);
    

    let selectionID = "#" + selection;
    
    setTimeout(function() { 
      $(selectionID).addClass("pressed");
      audio.src = "./sounds/" + selection + ".mp3";
      audio.load();
      audio.volume = volume;
      audio.play();
      setTimeout(function() { 
        $(selectionID).removeClass("pressed");
      }, 100);
    }, i * 1000);
  }
}

//create function to check if user selected correct sequence
$(".btn").on("click", function(event) { 
  audio.src = "./sounds/wrong.mp3";
  audio.load();
  audio.volume = volume;

  let targetElement = $(event.target).attr("id");
  // if the game is still going on and you got the correct selection
  if(!gameOver &&  targetElement == getSelectionID(sequence[sequenceGuessStep])) { 
    //animate the clicked button
    $("#" + targetElement).addClass("pressed");
    setTimeout(function() { 
      $("#" + targetElement).removeClass("pressed");
    }, 100);
    //if the guess was the last value in the sequence then generate the next sequence and show the user
    sequenceGuessStep++;
    if(sequenceGuessStep >= sequence.length) { 
      generateNextSequence();
      score++;
      sequenceGuessStep = 0;

      $("h1").text("Your current score is " + score + ".");

      setTimeout(function() { 
        animateSequence();
      }, 500);
    }
  } else { 
    // you must have lost the game
    gameOver = true;
    audio.play();
    $("h1").text("Game over. Your final score was " + score + ".");
    $("h2#newGame").remove();
    $("<h2 id='newGame'>Click any button to start anew!</h2>").insertAfter("h1");
  }
});

$(window).on("keypress", function(){ 
  //if game was over and the user clicked a key, reset game values and start the game anew
  startGame();
});

$("#volSlider").on("input", function(){
  console.log("updating volume");
  volume = $("#volSlider").val() / 100;
});

$("#startBtn").on("click", function(){ 
  startGame();
});

//create function to reset game objects
function resetGame() { 
  sequence = [];
  gameOver = false;
  sequenceGuessStep = 0;
  score = 0;
  $("h2#newGame").remove();
  $("h1").text("Game over. Your final score was " + score + ".");
}

function startGame() { 
  if(gameOver) { 
    resetGame();
    generateNextSequence();
    setTimeout(function() { 
      animateSequence();
    }, 500);
  }
}
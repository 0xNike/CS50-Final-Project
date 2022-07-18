document.addEventListener('DOMContentLoaded', function() {
    
    let gameOn = true

    let health = document.querySelector("#wojak-health")
    let clap = document.querySelector("#clap");
    let face = document.querySelector("#wojak-face");
    let mouth = document.querySelector("#wojak-mouth");
    let pscore = document.querySelector("#pscore");
    let wscore = document.querySelector("#wscore");
    let exportHealth = document.querySelector(".export-health");
    let importHealth = document.querySelector("#import-health");

    // Hide game first
    game = document.querySelector(".game");
    game.style.display = "none";

    // Import and Pre-Export Wojak's health
    
    console.log("js: Imported health at " + importHealth.textContent);
    var curr_health = importHealth.textContent;
    let insert_health = "width: " + curr_health + "% !important"; 
    health.setAttribute("style",insert_health);
    exportHealth.value = curr_health;

    // Check first player

    firstPlayer = 0

    wojakFirst = document.querySelector("#wojak")
    playerFirst = document.querySelector("#player")

    wojakFirst.addEventListener('click', function() {
        document.querySelector("#pregame").innerHTML = "";
        game.style.display = "initial";
        console.log("wojak first")
        clap.textContent = "Wojak's turn!"
        firstPlayer += 1;
    });
    
    playerFirst.addEventListener('click', function() {
        document.querySelector("#pregame").innerHTML = "";
        game.style.display = "initial";
        console.log("player first")
        clap.textContent = "Your turn!"
    });



    // For touchscreen users

    // We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
    var tap = new Hammer.Manager(clap);


    // Tap recognizer with minimal 2 taps
    tap.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    // Single tap recognizer
    tap.add( new Hammer.Tap({ event: 'singletap' }) );
    
    // Swipe recognizer
    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    var swipe = new Hammer(clap);
    swipe.get('swipe').set({ direction: Hammer.DIRECTION_ALL });


    // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
    tap.get('doubletap').recognizeWith('singletap');
    // we only want to trigger a tap, when we don't have detected a doubletap
    tap.get('singletap').requireFailure('doubletap');

    // Game Settings

    // Set up Wojak's directions
    const w_up = '<i class="fa-solid fa-hand-point-up fa-4x fa-beat"></i>';
    const w_down = '<i class="fa-solid fa-hand-point-down fa-4x fa-beat"></i>';
    const w_left = '<i class="fa-solid fa-hand-point-left fa-4x fa-beat"></i>';
    const w_right = '<i class="fa-solid fa-hand-point-right fa-4x fa-beat"></i>';

    let direction = [w_up, w_down, w_left, w_right];

    // Keep track of who is "offensive" by counting turns
    var turn = 0;
    var changedSides = false;

    // Keep track of Wins
    var wojak_wins = 0;
    var player_wins = 0;

    // User's Swipe Interactions
    if (gameOn) {
        swipe.on("swipeup swipedown swipeleft swiperight", function(ev) {
            number = Math.floor(Math.random() * 4);
            turn += 1;

            if (ev.type == "swipeup") {
                userSwipe = 0;
            }
            else if (ev.type == "swipedown") {
                userSwipe = 1;
            }
            else if (ev.type == "swipeleft") {
                userSwipe = 2;
            }
            else if (ev.type == "swiperight") {
                userSwipe = 3;
            }
            
            wojakSwipe = number;
            document.querySelector("#wojak-hands").innerHTML = direction[number];
            
            // Gameplay 

            // firstPlayer = 1 if wojak goes first
            // firstPlayer = 0 if player goes first


            // If point same direction
            if (userSwipe == wojakSwipe) {

                // If wojak starts first
                if (firstPlayer == 1) {
                    // Wojak wins
                    if (turn % 2 == 1) {
                        // console.log("WOJAK WINS")
                        wojak_wins += 1;
                    }
                    // player wins
                    else {
                        // console.log("PLAYER WINS")
                        player_wins += 1;
                        // deduct Wojak's health
                        curr_health -= 4;
                    }
                }
                // If player starts first
                else {
                    // Player wins 
                    if (turn % 2 == 1) {
                        // console.log("PLAYER WINS")
                        player_wins += 1;
                        curr_health -= 4;
                    }
                    // wojak wins 
                    else {
                        // console.log("WOJAK WINS")
                        wojak_wins += 1;

                    }
                }

                // The winner gets to continue playing offensive 
                turn += 1;
                wscore.innerHTML = wojak_wins
                pscore.innerHTML = player_wins

            }
            // If not point same direction
            else {
                // change button text
                if (changedSides == false) {
                    if (firstPlayer == 1 ) {
                        clap.innerHTML = "Your turn!";
                        changedSides = true;
                    }
                    else {
                        clap.innerHTML = "Wojak's turn!";
                        changedSides = true;
                    }
                }
                else {
                    if (firstPlayer == 1 ) {
                        clap.innerHTML = "Wojak's turn!";
                        changedSides = false;
                    }
                    else {
                        clap.innerHTML = "Your turn!";
                        changedSides = false;
                    }
                }             
            }
        });
    }


    swipe.on("swipe", function(ev) {

        // Track Wojak's health
        let insert_health = "width: " + curr_health + "% !important"; 
        health.setAttribute("style",insert_health);

        // Prepare to export Wojak's health
        exportHealth.value = curr_health;
        console.log("Current health to export: " + curr_health)
        
        // Track Wojak's expressions, use ev.type
        if (wojak_wins == 0 && curr_health < 50) {
            face.innerHTML = '<img src="/static/images/wojak-default.jpg" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "<p>Game on, girl.</p>";
        }
        else if (wojak_wins == 4 && wojak_wins > player_wins) {
            face.innerHTML = '<img src="/static/images/wojak-confident.png" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "<p>This is too easy.</p>";
        }
        else if (wojak_wins == 6 && wojak_wins > player_wins) {
            mouth.innerHTML = "<p>Drink up buddy!</p>";
        }
        else if (wojak_wins > 10 && player_wins < 10 && wojak_wins > player_wins) {
            mouth.innerHTML = "<p>We can do this all night.</p>";
            face.innerHTML = '<img src="/static/images/wojak-specs.jpg" class="img-thumbnail mx-auto d-block">';
        }
        else if (wojak_wins > 15 && player_wins > 12 && player_wins < 15 && wojak_wins > player_wins) {
            mouth.innerHTML = "<p>We can do this all night.</p>";
            face.innerHTML = '<img src="/static/images/wojak-specs.jpg" class="img-thumbnail mx-auto d-block">';
        }
        else if (player_wins >= 1 && player_wins < 3) {
            face.innerHTML = '<img src="/static/images/wojak-default.jpg" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "";    
        }
        else if (player_wins >= 3 && player_wins < 5) {
            face.innerHTML = '<img src="/static/images/wojak-pursed.jpg" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "<p>You're just lucky!</p>";
        }
        else if (player_wins >= 5 && player_wins < 7) {
            face.innerHTML = '<img src="/static/images/wojak-cry1.png" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "";
        }
        else if (player_wins >= 7 && player_wins < 10) {
            face.innerHTML = '<img src="/static/images/wojak-cry2.jpg" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "<p>.....</p>";
        }
        else if (player_wins >= 10 && player_wins < 15) {
            face.innerHTML = '<img src="/static/images/wojak-cry3.png" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "<p>I WILL NOT STOP UNTIL I WIN YOU</p>";
        }
        else if (player_wins >= 15 && player_wins < 20) {
            face.innerHTML = '<img src="/static/images/wojak-cry4.webp" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "";
        }
        else if (player_wins >= 20 && player_wins <= 24) {
            face.innerHTML = '<img src="/static/images/wojak-cry5.png" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "<p>YOU SHALL NOT PASS</p>";
        }
        else if (player_wins > 24 && player_wins > wojak_wins) {
            face.innerHTML = '<img src="/static/images/wojak-toh.jpg" class="img mx-auto d-block">';
            mouth.innerHTML = "<p>I'm out</p>";
        }
        // If Wojak toh
        if (curr_health <= 0) {

            // Change to toh face
            face.innerHTML = '<img src="/static/images/wojak-toh.jpg" class="img mx-auto d-block">';
            mouth.innerHTML = "<p>I'm out</p>";
            clap.textContent = "Wake Wojak up";
            
            // Disable gameplay part 1
            gameOn = false;
            console.log("YO! WOJAK IS KNOCKED OUT. COME CHECK ON HIM AFTER 30 SECONDS");
            document.querySelector("#wojak-hands").innerHTML = '<i class="fa-solid fa-hourglass fa-3x fa-fade"></i>';
            setTimeout(reviveWojak, 30000);
        }

    });

    // Loading of Last State face and hands
    // Disable gameplay part 2
    if (curr_health <= 0) {
        face.innerHTML = '<img src="/static/images/wojak-toh.jpg" class="img mx-auto d-block">';
        mouth.innerHTML = "<p>I'm out</p>";
        // hide pregame selection
        document.querySelector("#pregame").innerHTML = "";
        // show wojak hands
        game.style.display = "initial";
        clap.textContent = "Wake Wojak up"
        document.querySelector("#wojak-hands").innerHTML = '<i class="fa-solid fa-hourglass fa-3x fa-fade"></i>'
        
    }
    else if (curr_health <= 40 && curr_health > 30 && player_wins == 0) {
        face.innerHTML = '<img src="/static/images/wojak-hodl.jpg" class="img-thumbnail mx-auto d-block">';
    }
    else if (curr_health <= 30 && player_wins == 0) {
        face.innerHTML = '<img src="/static/images/wojak-cry1.png" class="img-thumbnail mx-auto d-block">';
    }

    tap.on("singletap", function(ev) {
        if (gameOn == false) {
            mouth.innerHTML = "<p>Let me sleep please</p>";
            setTimeout(wakingWojak, 2000)
        };
    });

    // List of Functions
    
    // Reset all settings to normal
    function reviveWojak() {
        console.log("ARISE WOJAK!")
        gameOn = true
        curr_health = "40";
        clap.textContent = "Swipe to Start"
        console.log("Wojak is alive! Health: " + curr_health)
        mouth.innerHTML = "<p>Let's go</p>";

    }

    function wakingWojak() {
        console.log("WOJAK!")
        mouth.innerHTML = "<p>I'm really drunk man</p>";
        setTimeout(trywakingWojak, 5000)
    }

    function trywakingWojak() {
        mouth.innerHTML = "<p>Okay, okay give me a sec</p>";
    }

    

});


document.addEventListener('DOMContentLoaded', function() {
    
    let wojakDrew = false;
    let renderedCards = false;
    let playerStands = false;
    let gameOn = true;

    let arena = document.querySelector("#arena");
    let health = document.querySelector("#wojak-health");
    let face = document.querySelector("#wojak-face");
    let mouth = document.querySelector("#wojak-mouth");
    let pscore = document.querySelector("#pscore");
    let wscore = document.querySelector("#wscore");
    let exportwScore = document.querySelector("#export-wscores")
    let exportpScore = document.querySelector("#export-pscores")
    let phand = document.querySelector("#phand");
    let whand = document.querySelector("#whand");
    let exportHealth = document.querySelector("#export-health");
    let importHealth = document.querySelector("#import-health");
    let hit = document.querySelector("#hit");
    let stand = document.querySelector("#stand");
    let psum = document.querySelector("#p-sum");
    let wsum = document.querySelector("#w-sum");
    let restart = document.querySelector("#restart")

    // Fixed Global Variables
    
    // Import and Pre-Export Wojak's health
    console.log("js: Imported health at " + importHealth.textContent);
    var curr_health = importHealth.textContent;
    let insert_health = "width: " + curr_health + "% !important"; 
    health.setAttribute("style",insert_health);

    // Load Wojak Face
    updateFace();
    
    // Count # of wins 
    w_wins = Number (wscore.textContent);
    p_wins = Number (pscore.textContent);

    // Deck variables
    const numberList = ["ace",2,3,4,5,6,7,8,9,"jack","queen","king"];
    const suitList = ["diamonds","clubs","hearts","spades"];


    // Hide game first
    game = document.querySelector(".game");
    game.style.display = "none";

    // Check first player
    
    var firstPlayer = 0;

    wojakFirst = document.querySelector("#wojak")
    playerFirst = document.querySelector("#player")

    wojakFirst.addEventListener('click', function() {
        document.querySelector("#pregame").setAttribute("style","display: none;");
        game.style.display = "initial";
        console.log("wojak first")
        mouth.innerHTML = "Hmm..."
        firstPlayer += 1;
        if (checkBJ() == false) {
            wojakDraws();
        }
        // Disable Hit and Stand Buttons
        hit.style.display = "none";
        stand.style.display = "none";
    });
    
    playerFirst.addEventListener('click', function() {
        document.querySelector("#pregame").setAttribute("style","display: none;");
        game.style.display = "initial";
        console.log("player first")
        checkBJ();
    
    });


    
    // Gameplay

    // Load Deck
    var Deck = [];
    for (suit in suitList) {
        for (num in numberList) {
            Deck.push(numberList[num] + "_of_" + suitList[suit] + ".svg");
        }
    }

    // Shuffle Deck
    shuffleDeck();

    // Serve cards to Wojak and Player in HTML
    var numCardServed = 4;

    whand.innerHTML = '<img class="image-stack__item--1" src="/static/svg/' + Deck[0] + '"></img>' +
                        '<img class="image-stack__item--2" src="/static/svg/Card_back_01.svg"></img>';

    phand.innerHTML = '<img class="image-stack__item--1" src="/static/svg/' + Deck[1] + '"></img>' +
                        '<img class="image-stack__item--2" src="/static/svg/' + Deck[3] + '"></img>';


    // Process Wojak's and Player's hands 
    
    // Decypher cards
    wfirstCard = Deck[0].split("_")
    wsecondCard = Deck[2].split("_")

    pfirstCard = Deck[1].split("_")
    psecondCard = Deck[3].split("_")

    // Check cards for picture    
    checkCards(wfirstCard, wsecondCard);
    checkCards(pfirstCard, psecondCard);

    // Note the number of aces in player's hands
    let p_aceinhand = 0;
    let w_aceinhand = 0;

    if (wfirstCard[0] == 11) {
        w_aceinhand += 1
        console.log("wojak got Ace in hand")
    }
    else if (wsecondCard[0] == 11) {
        w_aceinhand += 1
        console.log("wojak got Ace in hand")
    }

    if (pfirstCard[0] == 11) {
        p_aceinhand += 1
        console.log("player got Ace in hand")
    }
    else if (psecondCard[0] == 11) {
        p_aceinhand += 1
        console.log("player got Ace in hand")
    }


    var w_hands = wfirstCard[0] + wsecondCard[0];
    var p_hands = pfirstCard[0] + psecondCard[0];
    console.log("wojak's hand: " + w_hands)
    console.log("player's hand: " + p_hands)
    psum.innerHTML = p_hands;
    // Display unique case where dealt hands has Ace
    if (p_aceinhand > 0 && p_hands < 21) {
        psum.textContent =  String(p_hands - (p_aceinhand * 10)) + " or " + String(p_hands);
    }
    

    var w_nextCardCount = 3;
    var w_hiddenCards = "";


    // Listen for Hit and Stand

    var p_nextCardCount = 3;

    // If hit, assign another card to Player, Load Player Cards to HTML

    hit.addEventListener('click', function() {
        
        
        if (p_nextCardCount < 6) {
            var hitCard = Deck[numCardServed].split("_");
            checkOneCard(hitCard);
            if (hitCard[0] == 11) {
                p_aceinhand += 1;
            }
            phand.innerHTML += '<img class="image-stack__item--' + p_nextCardCount + '" src="/static/svg/' + Deck[numCardServed] + '"></img>'
            // Note number of cards served from Deck
            numCardServed += 1;
            // Note number of cards Player has
            p_nextCardCount += 1;
            // Calculate Player's hands
            p_hands += (hitCard[0]);
            console.log("Aces in hand:" + p_aceinhand)
            // Calculate hands for Player when there is an Ace
            if (p_hands > 21 && p_aceinhand > 0) {
                p_hands -= (p_aceinhand * 10);
                psum.innerHTML = p_hands;
                // Reset to 0 since deducted
                p_aceinhand = 0
                console.log("You were over 21, but Ace saved your life")
            }
            else if (p_aceinhand > 0 && p_hands < 21) {
                psum.textContent = String(p_hands - (p_aceinhand * 10)) + " or " + String(p_hands);
                console.log("U are still good")
            }
            else {
                psum.innerHTML = p_hands;
            }

            // Calculate hands for Player
            
            console.log("You drew: " + hitCard[0]);
            console.log("Your current sum:" + p_hands)
        }


        // Check for Blackjack
        if (p_hands == 21 || p_hands > 21) {
            checkWhoWins();
        }

        // Check for Wu-Long
        if (p_hands <= 21 && p_nextCardCount == 6) {
            wojakReveal();
            mouth.innerHTML = "NO WAY! YOU GOT 5-LONG"
            console.log("Player got Wu-Long!!!")
            p_wins += 2;
            curr_health -= 8;
        }

    });

    // If player clicks Stand
    stand.addEventListener('click', function() {
        console.log("end turn");

        // Disable Hit and Stand Buttons
        hit.style.display = "none";
        stand.style.display = "none";

        playerStands = true;
        
        // If Player went first
        if (firstPlayer == 0) {
            wojakDraws();
            mouth.innerHTML = "Hmmm...."
            console.log("CP Delta")
        }
        // wojakReveal();
        checkWhoWins();
        updateScores();
        console.log("Update CP B")
    });

    if (gameOn == false) {
        
    } 


    // List of functions
    
    // Shuffle with The Fisher Yates Method
    function shuffleDeck() {

        for (let i = Deck.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * i)
            let k = Deck[i]
            Deck[i] = Deck[j]
            Deck[j] = k
        }
    }



    // Check for Blackjack after dealing hands
    function checkBJ() {
        
        if (w_hands == 21) {
            console.log("Wojak got Blackjack!");
            face.innerHTML = '<img src="/static/images/wojak-specs.jpg" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "Blackjek."
            w_wins += 2;            
        }
        else if (p_hands == 21) {
            console.log("You got Blackjack!");
            mouth.innerHTML = "Yooo you're lucky!";
            p_wins += 2;
            curr_health -= 8;
        }
        else if (w_hands == 22) {
            console.log("Wojak got Ban-Ban!");
            face.innerHTML = '<img src="/static/images/wojak-specs.jpg" class="img-thumbnail mx-auto d-block">';
            mouth.innerHTML = "DAMN! Odds of getting that is 0.56%!";
            w_wins += 5;
            curr_health += 20;
        }
        else if (p_hands == 22) {
            console.log("You got Ban-Ban!");
            mouth.innerHTML = "DAMN! Odds of getting that is 0.56%!";
            p_wins += 5;
            curr_health -= 20;
        }
        else {
            return false;
        }
        wojakReveal();
        updateScores();
        console.log("It's a miracle")
        return true;
        

    }



    // Check for Picture and Aces
    function checkCards(card1, card2) {

        // Check first card
        if (card1[0].includes('jack') || card1[0].includes('queen') || card1[0].includes('king') ) {
        card1[0] = 10;
        }
        else if (card1[0].includes('ace')) {
            card1[0] = 11;
        }
        else {
            card1[0] = Number(card1[0]);
        }


        // Check second card
        if (card2[0].includes('jack') || card2[0].includes('queen') || card2[0].includes('king') ) {
            card2[0] = 10;
        }
        else if (card2[0].includes('ace')) {
            card2[0] = 11;
        }
        else {
            card2[0] = Number(card2[0]);
        }
    }



    function checkOneCard(card) {

        // Check first card
        if (card[0].includes('jack') || card[0].includes('queen') || card[0].includes('king') ) {
        card[0] = 10;
        }
        else if (card[0].includes('ace')) {
            card[0] = 11;
        }
        else {
            card[0] = Number(card[0]);
        }

    }



    function wojakDraws() {

        while (w_hands < 16 && w_nextCardCount < 6) {
            mouth.innerHTML = "Hmm..."    
            var w_hitCard = Deck[numCardServed].split("_");
            checkOneCard(w_hitCard);
            console.log("Wojak drew: " + w_hitCard[0])
            // Count number of Aces in hand
            if (w_hitCard[0] == 11) {
                w_aceinhand += 1;
            }
            setTimeout(renderCardback,1500);
            // Save the Cards' HTML to render later
            w_hiddenCards += '<img class="image-stack__item--' + w_nextCardCount + '" src="/static/svg/' + Deck[numCardServed] + '"></img>'
            // Calculate wojak's hands
            w_hands += (w_hitCard[0]);
            // In the case of Bust with Aces
            if (w_hands > 21 && w_aceinhand > 0) {
                w_hands -= 10;
                w_aceinhand -= 1;
            }
            // Note the number of cards served from Deck
            numCardServed += 1;
            // Note the number of wojak's cards
            w_nextCardCount += 1; 
            console.log("Current sum for Wojak:" + w_hands);                  
        }

        setTimeout(wojakEnds,3000);
    }



    function renderCardback() {
        mouth.innerHTML = "I'm gonna draw a card..."
        whand.innerHTML += '<img class="image-stack__item--2" src="/static/svg/Card_back_01.svg"></img>';
        renderedCards = true
    }


    // Inform that Wojak ends turn
    function wojakEnds() {

        // Check Wojak's hand
        if (firstPlayer == 1) {
            mouth.innerHTML = "Done! Your turn";
            setTimeout(clearSpeech,1000);
        }
        else {
            if (w_hands <= 21 && w_nextCardCount == 6) {
                console.log("Wojak got 5-Long!")
                checkWhoWins();
            }
        }
        // Reveal Cards when Wojak has 5 cards
        if (w_nextCardCount == 6) {
            checkWhoWins();
        }
        
    }
    

    // Reveal Wojak's hand
    function wojakReveal() {
        wsum.innerHTML = w_hands;
        whand.innerHTML = '<img class="image-stack__item--1" src="/static/svg/' + Deck[0] + '"></img>' +
                            '<img class="image-stack__item--2" src="/static/svg/' + Deck[2] + '"></img>' +
                            w_hiddenCards;
        
        updateScores();
        console.log("Cards revealed.")

        // Disable Hit and Stand Buttons
        hit.style.display = "none";
        stand.style.display = "none";
        
        if (curr_health > 0) {
            restart.setAttribute("style","display: initial;");
        }
        else {
            restart.style.display = "none;"
        }
        
    }



    function checkWhoWins() {

        
        // If Wojak started first
        if (firstPlayer == 1) {
            
            // Both bust
            if (p_hands > 21 && w_hands > 21) {
                wojakReveal();
                mouth.innerHTML = "It's a tie!"
            }
            // Player bust only
            else if (p_hands > 21 && w_hands <= 21) {
                wojakReveal();
                mouth.innerHTML = "You lost! Drink!"
                w_wins += 1
            }
            // Wojak bust only
            else if (w_hands > 21 && p_hands < 21) {
                wojakReveal();
                mouth.innerHTML = "You won!"
                p_wins += 1;
                curr_health -= 4;
            }
            // Player has lesser than Wojak
            else if (p_hands < w_hands) {
                wojakReveal();
                mouth.innerHTML = "You lost! Drink!"
                w_wins += 1
            }
            else if (w_hands <= 21 && w_nextCardCount == 6) {
                console.log("Wojak got WU-LONG")
                w_wins += 3;
                wojakReveal();
            }
            else if (p_hands == w_hands){
                wojakReveal();
                mouth.innerHTML = "It's a tie! Both drink :P"
            }
            else {
                wojakReveal();
                mouth.innerHTML = "Nice, you won this time"
                p_wins += 1
                curr_health -= 4;
            }
            
            console.log("Updated Scores")
            updateScores();
            console.log("Update CPE")
        }


        // If Player started first
        if (firstPlayer == 0) {
            
            if (p_hands > 21) {
                console.log("Oops! Now let's see if Wojak would bust")
                wojakDraws();
                // Disable Hit and Stand Buttons
                hit.style.display = "none";
                stand.style.display = "none";
                console.log("Player Busted!")
                
            }
            
            setTimeout(p1check,2500)
        }

        // Check if player blackjacks
        if (p_hands == 21) {
            
            wojakReveal();
            console.log("You got Blackjack!")
            mouth.innerHTML = "Nice, you won!"
            console.log("Updated Scores")
            p_wins += 2
            curr_health -= 8;
            updateScores();
            console.log("Update CP G")
            
        }

    }

    function updateScores() {
        
        // Update scores
        wscore.textContent = w_wins;
        pscore.textContent = p_wins;
        exportwScore.value = w_wins;
        exportpScore.value = p_wins;

        // Update Health
        insert_health = "width: " + curr_health + "% !important"; 
        health.setAttribute("style",insert_health);
        if (curr_health <= 0) {
            curr_health = 0;
            gameOn = false;
            setTimeout(disableGame,2000);
        }
        exportHealth.value = curr_health;

        // Update Face
        updateFace();

        console.log("Update Complete")

    }

    function clearSpeech() {
        mouth.innerHTML = "";
        // Enable Hit and Stand Buttons
        hit.style.display = "initial";
        stand.style.display = "initial";
    }

    function updateFace() {
        // Update Face
        if (curr_health == 100) {
            face.innerHTML = '<img src="/static/images/wojak-confident.png" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health < 100 && curr_health > 88) {
            face.innerHTML = '<img src="/static/images/wojak-default.jpg" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health <= 88 && curr_health > 72 ) {
            face.innerHTML = '<img src="/static/images/wojak-pursed.jpg" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health <= 72 && curr_health > 60 ) {
            face.innerHTML = '<img src="/static/images/wojak-cry1.png" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health <= 72 && curr_health > 60 ) {
            face.innerHTML = '<img src="/static/images/wojak-cry2.png" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health <= 60 && curr_health > 40 ) {
            face.innerHTML = '<img src="/static/images/wojak-cry3.png" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health <= 40 && curr_health > 32 ) {
            face.innerHTML = '<img src="/static/images/wojak-cry4.webp" class="img-thumbnail mx-auto d-block">';
        }
        else if (curr_health <= 32 && curr_health > 0 ) {
            face.innerHTML = '<img src="/static/images/wojak-cry5.png" class="img-thumbnail mx-auto d-block">';
        }
        else {
            face.innerHTML = '<img src="/static/images/wojak-toh.jpg" class="img-thumbnail mx-auto d-block">';
        }
        if (w_hands == 21) {
            face.innerHTML = '<img src="/static/images/wojak-specs.jpg" class="img-thumbnail mx-auto d-block">';
        }
    }

    function p1check() {
        console.log("Wojak has drawn. Let's see who won")
        wojakReveal();
        
        // Both bust
        if (p_hands > 21 && w_hands > 21) {
            mouth.innerHTML = "It's a tie!"
        }
        // Player bust only
        else if (p_hands > 21 && w_hands <= 21) {
            mouth.innerHTML = "You lost! Drink!"
            w_wins += 1;
        }
        // Wojak bust only
        else if (w_hands > 21 && p_hands <= 21) {
            mouth.innerHTML = "You won!"
            p_wins += 1;
            curr_health -= 4;
        }
        // Player has lesser than Wojak, while both under 21
        else if (p_hands < w_hands && w_hands < 21 && p_hands < 21) {
            mouth.innerHTML = "You lost! Drink!"
            w_wins += 1;
        }
        // Wojak got Wu Long
        else if (w_hands <= 21 && w_nextCardCount == 6){
            mouth.innerHTML == "Wu-Long, Wu-Kong!"
            curr_health += 1;
            w_wins += 3;
        }
        // Player has same as Wojak
        else if (p_hands == w_hands){
            mouth.innerHTML = "It's a tie! Both drink :P"
        }
        else {
            mouth.innerHTML = "Can you stop winning!"
            p_wins += 1
            curr_health -= 4;
        }
        updateScores();
    }

    // Disable gameplay

    function disableGame() {
        mouth.innerHTML = "I'm out";
        console.log("Wojak is out")
        arena.innerHTML = '<div class="container-fluid border border-white p-5"><i class="fa-solid fa-hourglass fa-3x fa-fade"></i></div>'
        restart.style.display = "none";
        setTimeout(reviveWojak,10000);
    }

    function reviveWojak() {
        mouth.innerHTML = "Aite, I'm back...kinda.";
        face.innerHTML = '<img src="/static/images/wojak-dead.jpg" class="img-thumbnail mx-auto d-block">';
        // game.style.display = "initial";
        arena.style.display = "none";
        restart.style.display = "initial";
        w_wins = 0;
        p_wins = 0;
        curr_health = 40;
        exportHealth.value = curr_health;
        updateScores();
        
    }


});

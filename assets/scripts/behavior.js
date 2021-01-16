/*
Declare an array of Quiz Questions. This is the anchor of the entire project. The object contains 3 keys:
   - 1: question: this populates within a <h2>
   - 2: selection: an array of multiple choices --- ONE WILL BE "answer"
   - 3: answer: note that the answer integer starts at 0 like an array, because it matches with the data-index*
The data-index is set via looping over quizQuestions array length, which loops as the buttons (question selections) are created 
*/
let quizQuestions = [
    {
    "question": "Commonly used data types DO NOT include:",
    "selection": ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    "answer": 2
    },
    {
    "question": "The condition in an if / else statement is enclosed within ____.",
    "selection": ["1. quotes", "2. curly brackets", "3. parentheses", "4. square brackets"],
    "answer": 2
    },
    {
    "question": "Arrays in JavaScript can be used to store ____.",
    "selection": ["1. numbers and strings", "2. other arrays", "3. booleans", "4. all of the above"],
    "answer": 3
    },
    {
    "question": "String values must be enclosed within ____ when being assigned to variables.",
    "selection": ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    "answer": 2
    },
    {
    "question": "A very useful tool used during development and debugging for printing content to the debugger is:",
    "selection": ["1. JavaScript", "2. terminal / bash", "3. for loops", "4. console.log"],
    "answer": 3
    }
];

/*
Here I declare 14 variables:
    1. quizSection is constantly emptied and refilled with: quizQuestions, endGame (enter initials), and the scoreBoard
    2. timeRemaining is just an integer! it decreases with the countDown(), and at endGame() it is the value assigned to finalScore
    3a. timeInCorner gets the <span> specifically wrapped around the textContent 75
    3b. timeInCorner (html) gets reassigned timeRemaining for each countDown() interval, and is used to +/- or check for time as well
    4. callCountDown is located in the timer(), it calls countDown() every 1000ms until the endGame() clearsOut this `timeoutID`
    5. finalScore is only declared now; it is heavily tied to timeRemaining; once it has a score, it gets added to the newScore object
    6a. userScores will be assigned either an [] if no scores exist, or an array of newScores, which get added to the scoreBoard() page
    6b. 'userScores', the localStorage Key, is parsed(get) and stringified(set) - it will always ever only be one key of 1 or more objects
    7. newScore is an object that receives the k:v pairs "name" (initials) and "score" (finalScore) and is pushed to the userScores array
    8a. quizArrayIndex is simply a counter for the quizQuestions array; it starts at 0 and will end the timer if there are no more questions
    8b. quizArrayIndex also is as an initiator/array[i] variable in two for loops:
         1. The 1st loop is stored in renderQuestion(); this innerHTMLs the question, then fills buttons with "selection" content array items 
         2. The 2nd loop is stored in toggleQuestion(); this checks for the data-index "choice" on event.target to compare it to the "answer"
    9. header is only used once; on the gif provided for the assignment model, "VIEW HIGHSCORES" + "TIME: 75" disappears on scoreBoard() call
    10. startBtn relates to the id of the "Start Quiz" button on the home screen (first sequence); when clicked it calls timer() & render?()
    11. acknowledgeAnswer is a <div> with an empty <p> that will either say "Correct" or "Wrong", or alert the user when initial input is 🗑️
    12. validateAnswer is the <p> within acknowledgeAnswer that either acknowledgesAnswer or warns the user if (no initials OR > 4 letters)
    13. hideStart targets the startText <div> and hides it once the startBtn begins the quiz/timer();
    14. viewScores skips the renderQuestion(), toggleQuestion(), endGame() and checkScore() programs and goes directly to calling scoreBoard()
*/
let quizSection = document.querySelectorAll('.quiz');
let timeRemaining = 75;
let timeInCorner = document.getElementById('timer');
let callCountDown;
let finalScore;
let userScores;
let newScore
let quizArrayIndex;
let header = document.getElementsByTagName('header');
let startBtn = document.getElementById('start');
let acknowledgeAnswer = document.getElementById('acknowledge-answer');
let validateAnswer = document.getElementById('validate-answer');
let hideStart = document.getElementsByClassName('startText');
let viewScores = document.getElementById('view-highscores');

// When "View Highscores" is clicked on home page, hide header, check localStorage for all prior scores, and show them on the scoreBoard()
viewScores.addEventListener('click', function() {
    hideStart[0].style.display = 'none';
    getScore();
    scoreBoard();
})

// When "Start Quiz" is clicked on home page, hide all startText, set quizArrayIndex to 0 for loops, begin timer() & call renderQuestions()
startBtn.addEventListener('click', function() {
    quizArrayIndex = 0;
    hideStart[0].style.display = 'none';
    timer();
    renderQuestion();
});

// countdown() decreases the time perpetually by calling the timer() - 75-1; Time:74; call timer(); 74-1; Time:73; call timer()...
function countDown() {
    timeRemaining--;
    timeInCorner.textContent = timeRemaining;
    timer();
};

// timer() sets timeout to call the countdown() decreaser until either timeRemaining === 0 OR quizArrayIndex number exceeds length of quiz?s
function timer() {
    callCountDown = setTimeout(countDown, 1000);
    if (timeRemaining < 1 || quizArrayIndex > quizQuestions.length - 1) {
        endGame();
    };
};
 
/*
Lots of moving pieces here:
    1. - If there are quiz Questions yet to be shown AND time is on the clock:
        a. - create <h2>, assign it text of the quizQuestion "question", add it to the quizSection and call a for loop
    2. - For each of the quizQuestions, there are 4 options to "selection" from, so loop over those and:
        b. - create <button>, assign it text of the selection[i], give it a data-index from 0-3, plus a class, add it to quizSection
    3. - Else if either no more quizQuestions or time on the clock:
        c. - call the endGame() function that lets you enter your initials
    4. - Call toggleQuestion(), which will call renderQuestion() again until the If conditional becomes false
*/
function renderQuestion() {
    if (quizArrayIndex < quizQuestions.length && timeRemaining > 0) {
        let questionHeading = document.createElement('h2');
        questionHeading.innerHTML = quizQuestions[quizArrayIndex].question;
        quizSection[0].append(questionHeading);
        for (let j = 0; j < quizQuestions[quizArrayIndex].selection.length; j++) {
            let button = document.createElement('button');
            button.innerHTML = quizQuestions[quizArrayIndex].selection[j];
            button.setAttribute('data-index', j);
            button.classList.add('selectionBtn');
            quizSection[0].append(button);
        };
    } else {
        endGame();
    };
    toggleQuestion();
};

// After informing the user of a Correct or Wrong answer, or of an Error if they've failed to add initials correctly, hide the inform <div>
function hideResult() {
    setTimeout(function() {
        validateAnswer.textContent = '';
        acknowledgeAnswer.style.display = 'none';
    }, 2000);
}

/*
Lots of moving pieces here:
    1. - Using the CSS class that was added to each "selection" button, make a button variable that houses an array of selectionBtns
    2. - For as long as the entire button length:
        a. - add an event listener that re-establishes the correct Quiz? answer AND clarifies the button the user has clicked/selected
    3. - If the user has selected the right choice corresponding with the "answer" (if a === b):
        b. - add 15 seconds to the clock; inform the user they are Correct, then call hideResult()
    4. - Else if the user has answered incorrectly:
        c. - remove 15 seconds from the clock; inform the user they are Wrong, then call hideResult()
    5. After running steps 2-4, raise the quizArrayIndex by 1 for the next "question", clear the screen text, and render-next-Question()
*/
function toggleQuestion() {
    let button = document.querySelectorAll('.selectionBtn');
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener("click", function(event) {
            let correctAns = quizQuestions[quizArrayIndex].answer;
            let choice = parseInt(event.target.getAttribute('data-index'));
            if (choice === correctAns) {
                timeRemaining = timeRemaining + 15;
                timeInCorner.textContent = timeRemaining;
                validateAnswer.textContent = 'Correct!';
                acknowledgeAnswer.style.display = 'block';
                hideResult();
            } else {
                timeRemaining = timeRemaining - 15;
                timeInCorner.textContent = timeRemaining;
                validateAnswer.textContent = 'Wrong!';
                acknowledgeAnswer.style.display = 'block';
                hideResult();
            };
            quizArrayIndex++;
            quizSection[0].innerHTML = '';
            renderQuestion();
        });
    }
};

/*
Lots of moving pieces here:
    1. - clear timer() set
    2. - clear text in quizSection
    3. - If time is at 0, make that the final score
    4. - Else if time is greater than 0, redefine this integer as the final score, but also update the screen with timeRemaining
    5. - Create text that tells user their finalScore, asks for initialsInput, offers submitBtn and adds this all to the quizSection
    6. - call checkScore() which checks if the initialsInput is valid or not, then gets past scores & sets all scores to scoreBoard()
*/
function endGame() {
    clearTimeout(callCountDown);
    quizSection[0].innerHTML = '';
    if (timeRemaining < 1) {
        finalScore = 0;
    } else {
        finalScore = timeRemaining;
    };
    timeInCorner.textContent = timeRemaining;
    let gameOverHeading = document.createElement('h2');
    let gameOverParagraph = document.createElement('p');
    let initialsContainer = document.createElement('div');
    let initialsLabel = document.createElement('label');
    let initialsInput = document.createElement('input');
    let initialsSubmit = document.createElement('button');
    gameOverHeading.textContent = 'All done!';
    gameOverParagraph.textContent = 'Your final score is ' + finalScore + '.';
    initialsLabel.textContent = 'Enter initials:';
    initialsSubmit.textContent = 'Submit';
    initialsContainer.setAttribute('class', 'initialsContainer');
    initialsInput.setAttribute('id', 'initialsInput');
    initialsSubmit.setAttribute('id', 'initialsSubmit');
    quizSection[0].append(gameOverHeading);
    quizSection[0].append(gameOverParagraph);
    quizSection[0].append(initialsContainer);
    initialsContainer.append(initialsLabel);
    initialsContainer.append(initialsInput);
    initialsContainer.append(initialsSubmit);
    checkScore();
};

// Called within checkScore(), this will warn the user to enter their initials correctly for 8 seconds then hide the Error <div>
function warningValidation() {
    acknowledgeAnswer.style.display = 'block';
    acknowledgeAnswer.style.color = 'red';
    acknowledgeAnswer.style.borderTopColor = 'red';
    setTimeout(function() {
        validateAnswer.textContent = '';
        acknowledgeAnswer.style.display = 'none';
    }, 8000);
}

/*
When checkScore() is run, it listens for when the initialsSubmit button is clicked:
    1. - stop it from refreshing the page, then get all scores from previous games played on the local machine
    2. - access the initialsInput #id, trim the value and convert it to a String (may already be a string but for good measure)
    3. - checkInput() either runs a warningValidation() if initials are input wrong
    4. - otherwise it calls the function that sets the score to localStorage AND calls the scoreBoard() function to show all scores
*/
function checkScore() {
    let submitBtn = document.getElementById('initialsSubmit');
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault();
        getScore()
        let initialsInput = document.getElementById("initialsInput");
        let initialsText = String(initialsInput.value.trim());
        function checkInput() {
            if (initialsText.length > 4) {
                validateAnswer.textContent = 'Please enter four or less letters!';
                warningValidation();
                return
            } else if (initialsText === "") {
                validateAnswer.textContent = 'Please enter your initials!';
                warningValidation();
                return
            } else {
                acknowledgeAnswer.style.display = 'none';
                setScore();
                scoreBoard();
            }
        }
        checkInput();
    })
};

/*
    1. - IF there are value pairs in a Key called userScore:
        a. - re-assign the userScores array to a parsed JSON string, containing n amount of newScore objects ("name", "score" keys)
    2. - ELSE
        b. - assign an empty array to userScores, making it ready for being pushed to.
*/
function getScore() {
    if (localStorage.getItem('userScores') !== null) {
        userScores = JSON.parse(localStorage.getItem('userScores'));
    } else {
        userScores = [];
    };
}

/*
    1. - Convert initialsInput to an uppercase string, assign it to userName
    2. - Add userName (uppercased initials) to newScore object, along with finalScore (timeRemaining) to make "name" "score" k:v pairs
    3. - Push each object to the userScores array
    4. - pass a k:v pair to the Storage object (or update its current state) containing the userScore array turned into a JSON string
*/
function setScore() {
    let userName = String(initialsInput.value).toUpperCase();
    newScore = {
        "name": userName,
        "score": finalScore
    };
    userScores.push(newScore);
    localStorage.setItem("userScores", JSON.stringify(userScores));
};

/*
Lots of moving pieces here:
    1. - create an <h2>, "Highscores"
    2. - create an <ul> that is empty
    3. - create a <div> buttonsContainer to style the returnHome/resetScoreBoard buttons
    4. - create a <button> that will call restartGame()
    5. - create a <button> that will resetGame() by clearing localStorage
    6. - clear all page content, then add all of the above content to the empty page
    7. - For each object within userScores:
        a. - create a <li> that contains a user's userScore k:v pairs ("name" userName, and "score" finalScore)
        b. - add this to the empty <ul>
    8. - add the buttonsContainer to the page AFTER the <ul> is filled so elements are in their proper order
*/
function scoreBoard() {
    let scoreBoardHeading = document.createElement('h2');
    let scoreBoardUnorderedList = document.createElement('ul');
    let buttonsContainer = document.createElement('div');
    let returnHome = document.createElement('button');
    let resetScoreBoard = document.createElement('button');
    header[0].innerHTML = '';
    quizSection[0].innerHTML = '';
    scoreBoardUnorderedList.setAttribute('id', 'scoreBoard');
    returnHome.setAttribute('id', 'restartBtn');
    returnHome.classList.add('btn-spacing');
    resetScoreBoard.setAttribute('id', 'resetBtn');
    resetScoreBoard.classList.add('btn-spacing');
    scoreBoardHeading.textContent = 'Highscores';
    returnHome.textContent = 'Go Back';
    resetScoreBoard.textContent = 'Clear Highscores';
    quizSection[0].append(scoreBoardHeading);
    quizSection[0].append(scoreBoardUnorderedList);
    for (let i = 0; i < userScores.length; i++) {
        let scoreBoardListItem = document.createElement('li');
        scoreBoardListItem.textContent = userScores[i].name + ':' + ' ' + userScores[i].score;
        scoreBoardUnorderedList.append(scoreBoardListItem);
        };
        quizSection[0].append(buttonsContainer);
        buttonsContainer.append(returnHome);
        buttonsContainer.append(resetScoreBoard);
    restartGame();
    resetGame();
};

// When restartBtn is clicked, replace() functions essentially like a refresh and does not provide a back button
function restartGame() {
    let restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', function(event) {
        event.preventDefault();
        location.replace("index.html");
    });
};

//When resetBtn is clicked, add an event listener that both clears the localStorage object AND removes the ul of now-cleared scores
function resetGame() {
    let resetBtn = document.getElementById('resetBtn');
    let clearScores = document.getElementById('scoreBoard');
    resetBtn.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.clear();
        clearScores.remove();
    });
};
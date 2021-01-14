// Declare Variables
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

let quizSection = document.querySelectorAll('.quiz');
let timeRemaining = 75;
let timerDisp = document.getElementById('timer');
let t;
let userScores;
let finalScore;
let quizArrayIndex;
let header = document.getElementsByTagName('header');
let startBtn = document.getElementById('start');
let acknowledgeAnswer = document.getElementById('acknowledge-answer');
let validateAnswer = document.getElementById('validate-answer');


// when game start is clicked, replace content on the index.html page
startBtn.addEventListener('click', function() {
    quizArrayIndex = 0;

    let hideStart = document.getElementsByClassName('flexbox');
    hideStart[0].style.display = 'none';

    timer();
    renderQuestion();
});

// reduce time remaining by 1 every second until cleared;
function countDown() {
    timeRemaining--;
    timerDisp.textContent = timeRemaining;
    timer();
};

// call dountdown every second unless game is over
function timer() {
    t = setTimeout(countDown, 1000);
    if (timeRemaining < 1 || quizArrayIndex > quizQuestions.length - 1) {
        endGame();
    };
};
 
// loop over questions
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

// loop through questions
function toggleQuestion() {
    let button = document.querySelectorAll('.selectionBtn');

    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener("click", function(event) {
            let correctAns = quizQuestions[quizArrayIndex].answer;
            let choice = parseInt(event.target.getAttribute('data-index'));

            if (choice === correctAns) {
                timeRemaining = timeRemaining + 15;
                timerDisp.textContent = timeRemaining;
                validateAnswer.textContent = 'Correct!';
                acknowledgeAnswer.style.display = 'block';
                setTimeout(function() {
                    validateAnswer.textContent = '';
                    acknowledgeAnswer.style.display = 'none';
                }, 2000);
            } else {
                timeRemaining = timeRemaining - 15;
                timerDisp.textContent = timeRemaining;
                validateAnswer.textContent = 'Wrong!';
                acknowledgeAnswer.style.display = 'block';
                setTimeout(function() {
                    validateAnswer.textContent = '';
                    acknowledgeAnswer.style.display = 'none';
                }, 2000);
            };

            quizArrayIndex++;
            quizSection[0].innerHTML = '';
            renderQuestion();
        });
    }
};

// end game when time runs out, create initials input to add to scoreboard
function endGame() {
    clearTimeout(t);
    quizSection[0].innerHTML = '';

    if (timeRemaining < 1) {
        finalScore = 0;
    } else {
        finalScore = timeRemaining;
    };

    timerDisp.textContent = timeRemaining;

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

//  when the submitInitials button is clicked, trim the input and (eventually) store to local storage
function checkScore() {
    let submitBtn = document.getElementById('initialsSubmit');
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (localStorage.getItem('userScores') !== null) {
            userScores = JSON.parse(localStorage.getItem('userScores'));
            userScoresInd = userScores.length;
        } else {
            userScores = [];
        };

        // then I want to see if I can make this to uppercasee in set score
        let initialsInput = document.getElementById("initialsInput");
        let initialsText = String(initialsInput.value.trim());
        console.log(initialsText.toUpperCase());

        // validate no more than 3-4 initials
        function checkInput() {
            if (initialsText.length > 4) {
                validateAnswer.textContent = 'Please enter four or less letters!';
                acknowledgeAnswer.style.display = 'block';
                acknowledgeAnswer.style.color = 'red';
                acknowledgeAnswer.style.borderTopColor = 'red';
                setTimeout(function() {
                    validateAnswer.textContent = '';
                    acknowledgeAnswer.style.display = 'none';
                }, 8000);
                return
            } else if (initialsText === "") {
                validateAnswer.textContent = 'Please enter your initials!';
                acknowledgeAnswer.style.display = 'block';
                acknowledgeAnswer.style.color = 'red';
                acknowledgeAnswer.style.borderTopColor = 'red';
                setTimeout(function() {
                    validateAnswer.textContent = '';
                    acknowledgeAnswer.style.display = 'none';
                }, 8000);
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

// 
function setScore() {
    let userName = String(initialsInput.value).toUpperCase();

    // push to storage
    newScore = {
        "name": userName,
        "score": finalScore
    };
    userScores.push(newScore);
    localStorage.setItem("userScores", JSON.stringify(userScores));
    initialsInput.value = '';

};

// create a scoreboard with two buttons to play again or clear the scoreboard
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

// restart button is complete
    function restartGame() {
    let restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', function(event) {
        event.preventDefault();

        // location.replace("file:///C:/Users/jonam/CodingQuiz/index.html");
        location.replace("index.html");
    });
};

// reset scoreboard template
function resetGame() {
    let resetBtn = document.getElementById('resetBtn');
    let clearScores = document.getElementById('scoreBoard');
    resetBtn.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.clear();
        clearScores.remove();
    });
};
// Make the Start button change pages when clicked.

var startBtn = document.getElementById('start');

startBtn.addEventListener('click', function() {
    // For testing on local machine.
    // let homePage = 'file:///C:/Users/jonam/CodingQuiz/index.html';
    // let quizPage = 'file:///C:/Users/jonam/CodingQuiz/quiz.html';

    // For production.
    let homePage = 'https://pythonidaer.github.io/CodingQuiz/index.html';
    let quizPage = 'https://pythonidaer.github.io/CodingQuiz/quiz.html';

    // https://pythonidaer.github.io/CodingQuiz/index.html
    // https://pythonidaer.github.io/CodingQuiz/quiz.html

    // (if location is index.html) then (location is quiz.html) otherwise (location is index.html)
    (location.href === homePage) && (location.href = quizPage) || (location.href = homePage);

})
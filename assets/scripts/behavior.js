// Make the Start button change pages when clicked.

var startBtn = document.getElementById('start');

startBtn.addEventListener('click', function() {
    // This needs to be changed for when the website is live.
    let homePage = 'file:///C:/Users/jonam/CodingQuiz/index.html';
    let quizPage = 'file:///C:/Users/jonam/CodingQuiz/quiz.html';

    // (if location is index.html) then (location is quiz.html) otherwise (location is index.html)
    (location.href === homePage) && (location.href = quizPage) || (location.href = homePage);

})
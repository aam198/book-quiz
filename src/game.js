const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//Elements that we will be updating to update question counter and Score at the top of the app 
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

const scoreText = document.getElementById('score');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

//Using FETCH API to grab the questions from the questions.JSON file
let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple")
    .then( res => {
        return res.json();
    }).then( loadedQuestions => {

        console.log(loadedQuestions.results);

        //Using Map to iterate through the array to get the items we want out of the public api array.
        questions = loadedQuestions.results.map( loadedQuestion => {
           //Calls the question from the array  
            const formattedQuestion = {
                question: loadedQuestion.question
            };
            // Calls the incorrect answers 
            const answerChoices = [ ... loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random()*3) *1;
            answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion ["choice" + (index+1)]= choice;
            });

            return formattedQuestion;
        });

    

        startGame();
    })
    // catch to show error maybe button to refresh
    .catch ( err => {
        console.error(err);
    });

//Constants

const CORRECT_BONUS = 10;
const MAX_QUESTIONS =5;

startGame = ()=>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = ()=>{

    if(availableQuestions.length === 0 || questionCounter>= MAX_QUESTIONS){
        //setting current score to local storage, for end.js
        localStorage.setItem('mostRecentScore', score);
        //go to end of game page
        return window.location.assign("/end.html");
    };
    questionCounter++;
    //Now that we know how many questions, below we will update the ID questionCounterText counter visible for the user. Template literals ES6.
    progressText.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`;
    
    //Updating the Progress Bar by updating the width of the progress bar
    progressBarFull.style.width=`${(questionCounter/ MAX_QUESTIONS) *100}%`;


    //to get random number within the length of the array
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach( choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    //Splice Method to take out a question that we already used 
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e =>{
        if(!acceptingAnswers) return;
        
        acceptingAnswers = false;

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        //Creates a class to classToApply
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct'
        : 'incorrect';

        if(classToApply=== 'correct'){
            incrementScore(CORRECT_BONUS);//Which was set above to be 10 points
        }

        //based on selected choice, it adds the class either correct or incorrect 
        selectedChoice.parentElement.classList.add(classToApply);
       //Set Time out so that the class is either incorrect or correct for a certain amount of time. And then gets a new Question (500 is milliseconds)
       setTimeout(()=>{
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
       }, 500);
       
    });

});

//function to check score and update the ID Score. 
incrementScore = num =>{
    score += num;
    scoreText.innerText = score;
}



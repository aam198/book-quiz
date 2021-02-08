const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

//converts string array into an object
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;


    console.log(highScores);


//Takes the local storage of current score and adds the text from local storage. 
finalScore.innerText = mostRecentScore +' points!';

if (mostRecentScore <= 0){
    finalScore.innerText = "Try Again!";
};


//Below, user will not be able to save unless they input text for saving. 
username.addEventListener("keyup", ()=>{
    saveScoreBtn.disabled = !username.value;
});


saveHighScore = e => {
    console.log("clicked save button");
    //forms by default will submit to new page so we're adding a prevent 
    e.preventDefault();

    //Creating Score object
    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value
    };

    highScores.push(score);
    //sorts the array to make sure it only shows the highest 5 scores

    highScores.sort((a,b) => b.score - a.score);
    highScores.splice(5);

    //Updating the localStorage 'highscores' into JSON text 
    localStorage.setItem("highScores", JSON.stringify(highScores));
    
    //Takes the user back to index.html after entering in their name and hitting save
    window.location.assign('/');

};


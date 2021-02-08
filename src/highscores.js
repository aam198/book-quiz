const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
console.log(highScores);

//Below we will need to go through local storage, and each score that is housed, we need to add a list (li) item to the ul for that score. Will use map 

highScoresList.innerHTML = highScores
    .map(score => {
         return `<li class='high-score'> ${score.name} - ${score.score}</li>`;
    }).join("")



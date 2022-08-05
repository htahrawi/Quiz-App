//Select Elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button')
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector('.results');
let countDownElement = document.querySelector('.countdown');

//Set Options 
let currentIndex = 0;
let rightAnswers =0 ;
let countDownInterval =0;

function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let questionCount = questionsObject.length;

            //create bullets + set question count
            createBullets(questionCount);
            
            //Add Question Data
            addQuestionData(questionsObject[currentIndex], questionCount);

            //start countdown
            countDown(3,questionCount);

            //Click on Sunbmit
            submitButton.onclick = () =>{
                //get the right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;

                //Increase Index 
                currentIndex++;

                //Check the answer
                checkAnswer(theRightAnswer, questionCount);

                //Remove Previous Question 
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                //Add question data
                addQuestionData(questionsObject[currentIndex],questionCount);
                
                //Handle Bullets class
                handleBullets();

                //start countdown 
                clearInterval(countDownInterval);
                countDown(3,questionCount);

                // Show Results 
                showResults(questionCount);
            };
        }
    };
    myRequest.open("GET","html_questions.json",true);
    myRequest.send();
}
getQuestions();


function createBullets(num){
    countSpan.innerHTML = num;
    //Create spans
    for (let i = 0; i < num; i++) {
        //create bullets
        let theBullet = document.createElement("span");
        //Check if it's first span 
        if (i===0) {
            theBullet.className = "on";
        }
        //Append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count){
    if (currentIndex<count) {
        //Create H2 question
        let questionTitle = document.createElement("h2");

        //create question text
        let questionText = document.createTextNode(obj['title']);

        // Append text to H2
        questionTitle.appendChild(questionText);

        //Append H2 to quizArea
        quizArea.appendChild(questionTitle);

        //create the answers
        for (let i = 1; i <= 4; i++) {
            //create main answer fiv
            let mainDiv = document.createElement("div");
            //Add Class To main div
            mainDiv.className = "answer";
            //create radio input
            let radioInput = document.createElement("input");
            //Add type + NAme + ID + Data-Attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = "answer_"+i;
            radioInput.dataset.answer = obj['answer_'+i];

            // Make First Option selected
            if (i===1) {
                radioInput.checked = true;
            }

            //create label
            let theLabel = document.createElement("label");

            // Add For Attribute
            theLabel.htmlFor = 'answer_'+i;

            //create label Text
            let theLabelText = document.createTextNode(obj['answer_'+i]);
        
            //Add the text to label
            theLabel.appendChild(theLabelText);

            //Add Input + label to main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //Append all divs to answers area
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rightAnswer, countQuestion){
    let answers = document.getElementsByName("question");
    let theChosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if(answers[i].checked){
            theChosenAnswer = answers[i].dataset.answer;
        }
        
    }
    if (rightAnswer === theChosenAnswer) {
        rightAnswers++;
    }
}
function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    });
}

function showResults(count){
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers > (count/2) && rightAnswers < count) {
            theResults = '<span class="good">GOOD </span>'+rightAnswers+'from '+count+'is Good';
        }else if(rightAnswers === count){
            theResults = '<span class="perfect ">Perfect</span>'+'All answers is Good';
        }else{
            theResults = '<span class="bad">Bad</span>, '+rightAnswers+' from '+count;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.marginTop = '10px';
    }
}

function countDown(duration, count){
    if (currentIndex < count) {
        let minutes, seconds; 
        countDownInterval = setInterval(function(){
            minutes = parseInt(duration/60);
            seconds = parseInt(duration%60);
            
            minutes = minutes<10?'0'+minutes: minutes;
            seconds = seconds<10?'0'+seconds: seconds;

            countDownElement.innerHTML = minutes+':'+seconds;
            if (--duration<0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000);
    }
}
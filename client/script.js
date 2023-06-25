import bot from './assets/bot.svg';
import user from './assets/user.svg';

//************************************************************* */
//************ CREATE THE LOGIC TO MAKE OUR AI APPLICATION WORK */
//************************************************************* */

//target html elements manually by using document.querySelector
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat-container');

//declare variable
let loadInterval;

/******** FUNCTION LOADER *************/
//set up the three dots loader for when the bot is "thinking"
function loader(element) {
    element.textContent = '';

    //function that sets another function and a second param that is a time interval (300 miliseconds)
    loadInterval = setInterval(() => {
        element.textContent += '.';

        //if the loader reaches three dots we want to reset it back to one dot (loop)
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300); 
}

/******** FUNCTION TYPETEXT *************/
//function that types one letter at a time
//a chatbot types one letter at a time, which is a user experience that replicates that the bot is thinking
//and giving out his/her response as we read it
//if it just gave us the answer all at once it would be a bad user experience

//element and text are parameters
function typeText(element, text) {
    let index = 0;

    //setInterval is a function that takes two parameters
    //first parameter is a function that will be executed every 20 miliseconds
    //second parameter is the time interval (20 miliseconds)
    let interval = setInterval(() => {

        //still typing
        if(index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval)
        }


    }, 20);
}

/******** FUNCTION GENERATE UNIQUE ID *************/
//function that creates a unique id for each message
//what is a way to generate a unique id? timestamp, a random number, hexadecimalString
function generateUniqueId() {
    const timestamp = Date.now();
    //Math.random() * 1000 generates a random number between 0 and 1000
    //Math.random() generates a floating-point, pseudo-random number in the range 0–1 (inclusive of 0, but not 1)
    const randomNumber = Math.random(); 
    const hexadecimalString = randomNumber.toString(16);
    //return `id-${timestamp}-${hexadecimalString}`;
    return `id-${timestamp}-${hexadecimalString}`;
}

/******* FUNCTION FOR THE MESSAGE CONTAINER ***** */
// have an icon for the bot and the user appear next to each message
// have different background stripes for each message 
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile"></div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

/**** HANDLE SUBMIT FUNCTION WHICH IS TRIGGER TO GET AI RESPONSE */

const handleSubmit = async (e) => {
    //dont want browser to refresh on submit
    e.preventDefault();

    //get form data
    const data = new FormData(form);

    //generate new chat stripe for the user
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset(); //clear text area input

    //bot chatstripe
    //const uniqueId = generateUniqueId(); //unique id for it's message
    const uniqueId = 485746563562;

    chatContainer.innerHTML += chatStripe(true, "", uniqueId); //generate chat stripe for the bot, the () is for loader

    //chatContainer.insertAdjacentHTML('beforeend', chatStripe(false, data.get('prompt')));

    //as user types keep scrolling
    chatContainer.scrollTop = chatContainer.scrollHeight;

    //fetch the uniqueId
    //const messageDiv = document.querySelector(`#${uniqueId}`);
    const messageDiv = document.getElementById(uniqueId);

    //turn on the loader
    loader(messageDiv);

    //get the data from the server
    const response = await fetch('https://project-a-o83f.onrender.com', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt: data.get('prompt')})
    })

    clearInterval(loadInterval); //turn off the loader '...'
    messageDiv.innerHTML = '';

    if(response.ok) {
        const data = await response.json();
        const parseData = data.bot.trim();
        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }

}



//add event listener for the form in order to call our handleSubmit function
form.addEventListener('submit', handleSubmit);

//the following allows the enter key to trigger the handleSubmit function
//alternatively you could add a button to the form and have the button trigger the handleSubmit function
form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
       handleSubmit(e);
    }
});







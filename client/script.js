import bot from './assets/bot.svg';
import user from './assets/user.svg';
import axios from 'axios';

//************************************************************* */
//************ CREATE THE LOGIC TO MAKE OUR AI APPLICATION WORK */
//************************************************************* */

//target html elements manually by using document.querySelector
const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')





/******** FUNCTION LOADER *************/
//set up the three dots loader for when the bot is "thinking"

let loadInterval

function loader(element) {
    element.textContent = '';

    //function that sets another function and a second param that is a time interval (300 miliseconds)
    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        //if the loader reaches three dots I want to reset it back to one dot (loop)
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
        if (index < text.length) {
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
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="message_wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile_icon">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
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

    // clear textarea input 
    form.reset();

    // bot's chatstripe
    //const uniqueId = generateUniqueId(); //unique id for it's message
    const uniqueId = generateUniqueId();
    //make sure there is always a space between quotations 
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    //as user types keep scrolling
    chatContainer.scrollTop = chatContainer.scrollHeight;

    //fetch the uniqueId
    const messageDiv = document.getElementById(uniqueId);

    //turn on the loader
    // messageDiv.innerHTML = "..."
    loader(messageDiv);

    //get the data from the server
    //when testing set this to be http://localhost:5000
    //otherwise https://project-a-o83f.onrender.com
    const response = await fetch('https://project-a-o83f.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    //turn off the loader '...'
    clearInterval(loadInterval);
    messageDiv.innerHTML = " ";

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 
        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
};

//add event listener for the form in order to call our handleSubmit function
//enable the user to submit via button or enter key
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
     };
});
import bot from './assets/bot.svg';
import user from './assets/user.svg';
import axios from 'axios';

//************************************************************* */
//************ CREATE THE LOGIC TO MAKE OUR PROJECT WORK */
//************************************************************* */

//target html elements manually by using document.querySelector
const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

/******** FUNCTION LOADER *************/
//set up the three dots loader for when the bot is "thinking"

let loadInterval;

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
//what is a way to generate a unique id? timestamp, and random number
function generateUniqueId() {
    const timestamp = Date.now(); //static method that returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
    const randomNumber = Math.random(); //static method
    const longString = randomNumber.toString(16);
    return `id-${timestamp}-${longString}`;
}


/******** FUNCTION CHAT ROW FORMATTING *************/
//function that creates (and formats) a chat row
//pass the data from the server
//pass the correct icon for the message
//pass the unique id for the message
function chatRow(isAi, value, uniqueId) {
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

/******** FUNCTION HANDLESUBMIT FUNCTION *************/
/**** this is my trigger to get the ai response */
/* https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing */

const handleSubmit = async (event) => {
    //dont want browser to refresh on submit
    event.preventDefault();

    //get form data
    const data = new FormData(form);

    //generate new chat stripe for the user
    chatContainer.innerHTML += chatRow(false, data.get('prompt'));

    // clear textarea input 
    form.reset();

    // bot's chatrow
    //const uniqueId = generateUniqueId(); //unique id for it's message
    const uniqueId = generateUniqueId();
    //make sure there is always a space between quotations 
    chatContainer.innerHTML += chatRow(true, " ", uniqueId);

    //as user types keep scrolling
    chatContainer.scrollTop = chatContainer.scrollHeight;

    //fetch the uniqueId
    const messageDiv = document.getElementById(uniqueId);

    //turn on the loader
    // messageDiv.innerHTML = "..."
    loader(messageDiv);

    //get the data from the server - server is being hosted by render.com for public consumption
    //and post it to the page
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
form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSubmit(event);
     };
});


//************************************************************* */
//************ LAUNCH THE MODAL THAT IS IN THE FOOTER */
//************************************************************* */


let modal = document.getElementById("aboutModal");
let btn = document.getElementById("aboutBtn");
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
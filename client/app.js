const socket = io();

const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = ''; 
addMessageForm.autocomplete = "off";

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', ({userName}) => addMessage('chatBot', `${userName} has joined the conversation!`));
socket.on('removeUser', ({userLogin}) => addMessage('chatBot', `${userLogin.userName} has left the conversation... :(`));

function login(e) {
  e.preventDefault();
  if (userNameInput.value !== '') {
    userName = userNameInput.value; 
    socket.emit('join', { userName: userName });
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  } else {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = "Wprowadź nazwę użytkownika";
    errorMessage.classList.add("error-message");
    document.body.appendChild(errorMessage);
  }
};

loginForm.addEventListener("submit", function(e) {
  login(e);
});

function sendMessage(e) {
    e.preventDefault();
    if (messageContentInput.value !== '') { 
      addMessage(userName, messageContentInput.value);
      socket.emit('message', { author: userName, content: messageContentInput.value });
      messageContentInput.value ='';
    }else {
      console.log("Wpisz swoją wiadomość"); 
    }
  };

  function addMessage(author, content) {
    
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');

    if(author === userName){
      message.classList.add('message--self');
    } else if(author === 'chatBot'){
      message.classList.add('message--chatBot');
    };
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
  };

addMessageForm.addEventListener("submit", function(e) {
    sendMessage(e);
  });

 
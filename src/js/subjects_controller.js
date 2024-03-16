import { loadQuestion } from './load_questions.js';

async function SaveSubjectsToLocalStorage() {
    let res
    let data = [];
     try {
        res = await fetch('https://chatull.onrender.com/documents')
        data = await res.json()
        data = data.map(doc => doc.name)
    } catch (error) {
        console.log(error)
    }
    console.log("Hafeaqw");
    localStorage.setItem('subjects', JSON.stringify(data));

    if (!localStorage.getItem('chats')) {
        localStorage.setItem('chats', JSON.stringify({}));
        // save some chats to local storage
        let chats = {};
        let exampleChatKey = "Asignatura de ejemplo";
        chats[exampleChatKey] = [
            {
                "question": "",
                "answer": "¡Hola! Soy ChatULL, tu asistente virtual. Primero, selecciona la Guía Docente sobre la que quieres preguntar a través del buscador situado en la esquina inferior derecha de la pantalla."
            }
        ];
        localStorage.setItem('chats', JSON.stringify(chats));   
    }

    loadQuestion({"answer": "¡Hola! Soy ChatULL, tu asistente virtual. Primero, selecciona la Guía Docente sobre la que quieres preguntar a través del buscador situado en la esquina inferior derecha de la pantalla."}, false);
}

function GetCurrentSubjectsChats() {
    return JSON.parse(localStorage.getItem('chats'));
}

function GetChatByName(chatName) {
    let chats = GetCurrentSubjectsChats();
    return chats[chatName];
}

function LoadChatToChatContainer(event) {
    let chatName = event.target.textContent;
    let chat = GetChatByName(chatName);
    let chatContainer = document.querySelector('div.chat-container');
    chatContainer.innerHTML = "";
    chat.forEach((question) => {
        if (question.question === "") {
            loadQuestion(question, false);
        } else {
            loadQuestion(question, true);
            loadQuestion(question, false);
        }
    });
}

function LoadChatsToLateralMenu() {
    let chats = GetCurrentSubjectsChats();
    let lateralMenu = document.querySelector('ul.lateral-menu');
    lateralMenu.innerHTML = "";

    let title = document.createElement('h1');
    title.textContent = "Chats";
    title.classList.add('text-2xl', 'font-bold', 'p-4');
    lateralMenu.appendChild(title);

    // chats is an object, so we need to iterate and get the keys
    for (let chat in chats) {
        console.log(chat);
        let chatElement = document.createElement('li');
        let chatElementAnchor = document.createElement('a');
        chatElementAnchor.textContent = chat;
        chatElementAnchor.href = "#";
        chatElementAnchor.addEventListener('click', LoadChatToChatContainer);
        chatElement.appendChild(chatElementAnchor);
        lateralMenu.appendChild(chatElement);
    }
}

function LoadSubjectsToLateralMenu() {
    let subjects = JSON.parse(localStorage.getItem('subjects'));
    let lateralMenu = document.querySelector('ul.lateral-menu');
    let title = document.createElement('h1');
    title.textContent = "Asignaturas";
    title.classList.add('text-2xl', 'font-bold', 'p-4');
    lateralMenu.appendChild(title);

    subjects.forEach((subject) => {
        let subjectElement = document.createElement('li');
        let subjectElementAnchor = document.createElement('a');
        subjectElementAnchor.textContent = subject;
        subjectElementAnchor.href = "#";
        subjectElementAnchor.addEventListener('click', LoadChatToChatContainer);
        subjectElement.appendChild(subjectElementAnchor);
        lateralMenu.appendChild(subjectElement);
    });
}

SaveSubjectsToLocalStorage();
LoadSubjectsToLateralMenu();





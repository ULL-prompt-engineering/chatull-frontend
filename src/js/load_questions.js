/*
<div class="message-container user-message flex justify-end">
    <div class="UserMessage bg-blue-500 text-white rounded-lg p-2 mb-5 font-bold">
        Usuario
        <div class="message bg-green-500 text-white rounded-lg p-2 mt-2">
            ¿Cuál es tu nombre?
        </div>
    </div>
</div>
<div class="message-container bot-message flex">
    <div class="BotMessage bg-purple-600 rounded-lg p-2 mb-5 font-bold">
        ChatUll
        <div class="message bg-gray-300 text-gray-700 rounded-lg p-2 mt-2">
            Hola, soy ChatUll. ¿En qué puedo ayudarte?
        </div>
    </div>
</div>
*/

function loadQuestion(questionData, isQuestion) {
    if (isQuestion) {
        let messageContainer = document.createElement("div");
        messageContainer.setAttribute("class", "message-container bg-[#a3bcff] user-message flex flex-row items-center mt-5 rounded-lg");
        let userMessage = document.createElement("div");
        userMessage.setAttribute("class", "UserMessage text-white rounded-lg p-2 mb-5 font-bold");
        let userPhoto = document.createElement("img");
        userPhoto.setAttribute("class", "rounded-full ml-4 mr-4 mt-4 mb-4 max-h-16 m-w-16");
        userPhoto.setAttribute("src", "https://www.clipartmax.com/png/middle/434-4349876_profile-icon-vector-png.png");
        messageContainer.appendChild(userPhoto);
        let message = document.createElement("div");
        message.setAttribute("class", "message text-white rounded-lg");
        message.innerHTML = questionData.question;
        userMessage.appendChild(message);
        messageContainer.appendChild(userMessage);
        document.querySelector("div.chat-container").appendChild(messageContainer);
        messageContainer.scrollIntoView();
    } else {
        let messageContainer = document.createElement("div");
        messageContainer.setAttribute("class", "message-container bot-message bg-[#447058] flex flex-row items-center mt-5 rounded-lg");
        let botMessage = document.createElement("div");
        botMessage.setAttribute("class", "BotMessage rounded-lg p-2 mb-5 font-bold");
        let botPhoto = document.createElement("img");
        botPhoto.setAttribute("class", "rounded-full ml-4 mr-4 mt-4 mb-4 max-h-16 m-w-16");
        botPhoto.setAttribute("src", "https://www.ibiae.com/wp-content/uploads/2021/03/SARA-ASISTENTE-VIRTUAL.jpg");
        messageContainer.appendChild(botPhoto);
        let message = document.createElement("div");
        message.setAttribute("class", "message text-white rounded-lg");
        message.innerHTML = questionData.answer;
        botMessage.appendChild(message);
        messageContainer.appendChild(botMessage);
        document.querySelector("div.chat-container").appendChild(messageContainer);
        messageContainer.scrollIntoView();
    }
}
const selector = document.querySelector('select.subject');
let questions = localStorage.getItem(selector.value);

if (questions) {
    questions = JSON.parse(questions);
    questions.forEach((question) => {
        loadQuestion(question, true);
        loadQuestion(question, false);
    });
}

selector.addEventListener("change", function(event) {
    console.log("change");
    let questions = localStorage.getItem(selector.value);
    document.querySelector("div.chat-container").innerHTML = "";
    if (questions) {
        questions = JSON.parse(questions);
        questions.forEach((question) => {
            loadQuestion(question, true);
            loadQuestion(question, false);
        });
    }
});

export { loadQuestion };
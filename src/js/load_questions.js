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
        messageContainer.setAttribute("class", "message-container user-message flex justify-end");
        let userMessage = document.createElement("div");
        userMessage.setAttribute("class", "UserMessage bg-blue-500 text-white rounded-lg p-2 mb-5 font-bold");
        userMessage.innerHTML = "Usuario";
        let message = document.createElement("div");
        message.setAttribute("class", "message bg-white text-black rounded-lg p-2 mt-2");
        message.innerHTML = questionData.question;
        userMessage.appendChild(message);
        messageContainer.appendChild(userMessage);
        document.querySelector("div.chat-container").appendChild(messageContainer);
        messageContainer.scrollIntoView();
    } else {
        let messageContainer = document.createElement("div");
        messageContainer.setAttribute("class", "message-container bot-message flex");
        let botMessage = document.createElement("div");
        botMessage.setAttribute("class", "BotMessage bg-purple-600 rounded-lg p-2 mb-5 font-bold");
        botMessage.innerHTML = "ChatUll";
        let message = document.createElement("div");
        message.setAttribute("class", "message bg-gray-300 text-gray-700 rounded-lg p-2 mt-2");
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
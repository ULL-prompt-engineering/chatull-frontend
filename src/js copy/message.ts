class Message {
  constructor(text: string, isQuestion: boolean) {
    this.text = text;
    this.isQuestion = isQuestion;
  }

    public buildMessage(): HTMLElement {
        return this.isQuestion ? this.buildQuestion() : this.buildAnswer();
    }

    private buildAnswer(): HTMLElement {
        let messageContainer = document.createElement("div");
        messageContainer.setAttribute("class", "message-container bot-message bg-[#447058] flex flex-row items-center mt-5 mb-5 rounded-lg");
        let botMessage = document.createElement("div");
        botMessage.setAttribute("class", "BotMessage rounded-lg p-2 mb-5 font-bold");
        let botPhoto = document.createElement("img");
        botPhoto.setAttribute("class", "rounded-full ml-4 mr-4 mt-4 mb-4 max-h-16 m-w-16");
        botPhoto.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo_Z_c6fOXTkTHFylBBTIImwmwhXx_4qqdKrx1YL82EA&s");
        messageContainer.appendChild(botPhoto);
        let message = document.createElement("div");
        message.setAttribute("class", "message text-white rounded-lg");
        message.innerHTML = this.text;
        botMessage.appendChild(message);
        messageContainer.appendChild(botMessage);

        return messageContainer;
    }

    private buildQuestion(): HTMLElement {
        let messageContainer = document.createElement("div");
        messageContainer.setAttribute("class", "message-container bg-[#a3bcff] user-message flex flex-row items-center rounded-lg");
        let userMessage = document.createElement("div");
        userMessage.setAttribute("class", "UserMessage text-white rounded-lg p-2 mb-5 font-bold");
        let userPhoto = document.createElement("img");
        userPhoto.setAttribute("class", "rounded-full ml-4 mr-4 mt-4 mb-4 max-h-16 m-w-16");
        userPhoto.setAttribute("src", "https://www.clipartmax.com/png/middle/434-4349876_profile-icon-vector-png.png");
        messageContainer.appendChild(userPhoto);
        let message = document.createElement("div");
        message.setAttribute("class", "message text-white rounded-lg");
        message.innerHTML = this.text;
        userMessage.appendChild(message);
        messageContainer.appendChild(userMessage);
        return messageContainer;
    }

    private text: string;
    private isQuestion: boolean;
};

export { Message };
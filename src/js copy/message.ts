class Message {
  constructor(text: string, isQuestion: boolean) {
    this.text = text;
    this.isQuestion = isQuestion;
  }

  public GetText(): string {
    return this.text;
  }

  public IsQuestion(): boolean {
    return this.isQuestion;
  }

  public buildMessage(): HTMLElement {
    let messageContainer = document.createElement("div");
    if (this.isQuestion) {
      messageContainer.setAttribute(
        "class",
        "message-container bg-[#a3bcff] user-message flex flex-row items-center rounded-lg"
      );
    } else {
      messageContainer.setAttribute(
        "class",
        "message-container bot-message bg-[#447058] flex flex-row items-center mt-5 mb-5 rounded-lg"
      );
    }
    let message = document.createElement("div");
    if (this.isQuestion) {
      message.setAttribute(
        "class",
        "UserMessage text-white rounded-lg p-2 mb-5 font-bold"
      );
    } else {
      message.setAttribute("class", "BotMessage rounded-lg p-2 mb-5 font-bold");
    }
    let photo = document.createElement("img");
    photo.setAttribute(
      "class",
      "rounded-full ml-4 mr-4 mt-4 mb-4 max-h-16 m-w-16"
    );
    if (this.isQuestion) {
      photo.setAttribute(
        "src",
        "https://www.clipartmax.com/png/middle/434-4349876_profile-icon-vector-png.png"
      );
    } else {
      photo.setAttribute(
        "src",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo_Z_c6fOXTkTHFylBBTIImwmwhXx_4qqdKrx1YL82EA&s"
      );
    }
    messageContainer.appendChild(photo);
    let messageText = document.createElement("div");
    messageText.setAttribute("class", "message text-white rounded-lg");
    messageText.innerHTML = this.text;
    message.appendChild(messageText);
    messageContainer.appendChild(message);
    return messageContainer;
  }

  private text: string;
  private isQuestion: boolean;
}

export { Message };

class Message {
  constructor(text: string, isQuestion: boolean) {
    this.text_ = text;
    this.is_question_ = isQuestion;
  }

  public GetText(): string {
    return this.text_;
  }

  public IsQuestion(): boolean {
    return this.is_question_;
  }

  public BuildMessage(): HTMLElement {
    let messageContainer = document.createElement("div");
    if (this.is_question_) {
      messageContainer.setAttribute(
        "class",
        "message-container bg-[#B7B7B7] user-message flex flex-row items-center rounded-lg"
      );
    } else {
      messageContainer.setAttribute(
        "class",
        "message-container bot-message bg-[#723499] flex flex-row items-center mt-5 mb-5 rounded-lg"
      );
    }

    let role_container = document.createElement("div");
    role_container.setAttribute("class", "role-container flex flex-col items-center px-4 py-2");

    let role_message = document.createElement("div");
    role_message.setAttribute("class", "role-message p-1 text-white font-bold");
    role_message.innerHTML = this.is_question_ ? "Tú" : "Chatull";

    let message = document.createElement("div");
    if (this.is_question_) {
      message.setAttribute(
        "class",
        "UserMessage rounded-lg p-2 font-bold"
      );
    } else {
      message.setAttribute("class", "BotMessage rounded-lg p-2 font-bold");
    }
    let photo = document.createElement("img");
    photo.setAttribute(
      "class",
      "rounded-full ml-4 mr-4 mb-4 max-h-16 m-w-16 border border-2 border-white"
    );
    if (this.is_question_) {
      photo.setAttribute(
        "src",
        "/user.webp"
      );
    } else {
      photo.setAttribute(
        "src",
        "ull_icon.png"
      );
    }
    messageContainer.appendChild(role_container);
    role_container.appendChild(role_message);
    role_container.appendChild(photo);
    let messageText = document.createElement("div");
    messageText.setAttribute("class", "message text-white rounded-lg");
    messageText.innerHTML = this.text_;
    message.appendChild(messageText);
    messageContainer.appendChild(message);
    return messageContainer;
  }

  private text_: string;
  private is_question_: boolean;
}

export { Message };

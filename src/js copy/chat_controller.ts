// Create a class for chat controll inspired in /src/js folder

import { Message } from "./message";
import { SubjectController } from "./subject_controller";
import { SessionController } from "./session_controller";

class Chat {
  constructor(
    chat_container_tag: string,
    chat_input_tag: string,
    chat_button_tag: string,
    subject_selector_tag: string,
    menu_selector_tag: string
  ) {
    this.chatContainer = document.querySelector(
      chat_container_tag
    ) as HTMLElement;
    this.chatInput = document.querySelector(chat_input_tag) as HTMLInputElement;
    this.chatButton = document.querySelector(
      chat_button_tag
    ) as HTMLButtonElement;
    this.subjectController = new SubjectController(
      subject_selector_tag,
      menu_selector_tag
    );
    this.sessionController = new SessionController();
  }

  public init() {
    this.chatButton.addEventListener("click", async () => {
      let question = this.GetQuestion();
      let question_message = new Message(question, true);
      this.AddMessageToChat(question_message);

      let response: string = await this.GetQuestionAnswer();
      let response_message = new Message(response, false);
      this.AddMessageToChat(response_message);
    });

    this.chatInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.chatButton.click();
      }
    });
  }

  private GetQuestion() {
    let question = this.chatInput.value;
    this.chatInput.value = "";
    return question;
  }

  private async GetQuestionAnswer() : Promise<string> {
    let question = this.GetQuestion();
    // adapta question para que sea compatible con la URL
    question = question.replace(/ /g, "%20");
    let url = "";
    let subject = this.subjectController.GetSelectedSubject();
    let sessionToken = this.sessionController.GetSessionToken();

    if (subject != "Reglamentacion y Normativa") {
      url =
        "https://chatull.onrender.com/get_answer/" +
        sessionToken +
        "?question=" +
        question +
        "&subject=" +
        subject;
    } else {
      url =
        "https://chatull.onrender.com/get_teacher_answer/" +
        sessionToken +
        "?question=" +
        question;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data.answer;
      })
      .catch((error) => {
        console.error("Error:", error);
        // button.disabled = false;
        // button.innerHTML = "Enviar";
        return "Error al obtener respuesta";
      });

    return "Error al obtener respuesta";
  }

  private AddMessageToChat(message: Message) {
    this.chatContainer.appendChild(message.buildMessage());
  }

  
  

  private chatContainer: HTMLElement;
  private chatInput: HTMLInputElement;
  private chatButton: HTMLButtonElement;
  private subjectController: SubjectController;
  private sessionController: SessionController;
}

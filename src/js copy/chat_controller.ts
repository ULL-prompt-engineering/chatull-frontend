// Create a class for chat controll inspired in /src/js folder

import { Message } from "./message";
import { SubjectController } from "./subject_controller";
import { SessionController } from "./session_controller";

class ChatController {
  constructor(
    chat_container_tag: string,
    chat_input_tag: string,
    chat_button_tag: string,
    subject_selector_tag: string,
    menu_selector_tag: string
  ) {
    this.chat_container_ = document.querySelector(
      chat_container_tag
    ) as HTMLElement;
    this.chat_input_ = document.querySelector(
      chat_input_tag
    ) as HTMLInputElement;
    this.chat_button_ = document.querySelector(
      chat_button_tag
    ) as HTMLButtonElement;
    this.subject_controller_ = new SubjectController(
      subject_selector_tag,
      menu_selector_tag
    );

    this.Init();

    this.session_controller_ = new SessionController();
  }

  public Init() {
    this.chat_button_.addEventListener("click", async () => {
      let question = this.GetQuestion();
      let question_message = new Message(question, true);
      this.AddMessage(question_message);

      let response: string = await this.GetQuestionAnswer();
      let response_message = new Message(response, false);
      this.AddMessage(response_message);
    });

    let self = this;
    this.chat_input_.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        self.chat_button_.click();
      }
    });

    this.subject_controller_
      .GetSubjectSelector()
      .addEventListener("change", () => {
        this.LoadChatFromLocalStorage();
        this.chat_container_.scrollTop = this.chat_container_.scrollHeight;
        this.RemoveClassToSubjects();
        this.AddClassToChooseSubject();
      });
  }

  private AddClassToChooseSubject() {
    let actual_subject = this.subject_controller_.GetSelectedSubject();
    let subject = document.querySelector(
      "." + actual_subject.replace(/ /g, "_")
    ) as HTMLElement;
    if (subject) {
      subject.classList.add("bg-[#a3bcff]", "selected_subject");
    }
  }

  private RemoveClassToSubjects() {
    let subject = document.querySelector(".selected_subject") as HTMLElement;
    if (subject) {
      subject.classList.remove("bg-[#a3bcff]", "selected_subject");
    }
  }

  private GetQuestion() {
    let question = this.chat_input_.value;
    return question;
  }

  private async GetQuestionAnswer(): Promise<string> {
    let question = this.GetQuestion();
    // adapta question para que sea compatible con la URL
    question = question.replace(/ /g, "%20");
    let url = "";
    let subject = this.subject_controller_.GetSelectedSubject();
    let sessionToken = this.session_controller_.GetSessionToken();

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

    let res;
    let data;
    try {
      res = await fetch(url);
      data = await res.json();
      this.chat_input_.value = "";
      data = data.answer;
    } catch (error) {
      console.error("Error:", error);
      data = "Error al obtener respuesta";
    }
    return data;
  }

  private AddMessageToChat(message: Message) {
    this.chat_container_.appendChild(message.BuildMessage());
    this.chat_container_.scrollTop = this.chat_container_.scrollHeight;
  }

  private AddMessageToLocalStorage(message: Message) {
    let actual_subject = this.subject_controller_.GetSelectedSubject() || "";
    if (actual_subject == "") {
      return;
    }

    let chats = JSON.parse(localStorage.getItem("chats") || "{}");
    if (actual_subject in chats) {
      chats[actual_subject].push(message);
    } else {
      chats[actual_subject] = [message];
    }
    localStorage.setItem("chats", JSON.stringify(chats));
  }

  private AddMessage(message: Message) {
    this.AddMessageToChat(message);
    this.AddMessageToLocalStorage(message);
  }

  private LoadChatFromLocalStorage() {
    this.chat_container_.innerHTML = "";
    let actual_subject = this.subject_controller_.GetSelectedSubject() || "";
    if (actual_subject == "") {
      return;
    }

    let chats = JSON.parse(localStorage.getItem("chats") || "{}");
    if (actual_subject in chats) {
      for (let message of chats[actual_subject]) {
        message = new Message(message.text_, message.is_question_);
        this.AddMessageToChat(message);
      }
    }
  }

  private chat_container_: HTMLElement;
  private chat_input_: HTMLInputElement;
  private chat_button_: HTMLButtonElement;
  private subject_controller_: SubjectController;
  private session_controller_: SessionController;
}

export { ChatController };

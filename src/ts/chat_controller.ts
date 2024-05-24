let API_URL = import.meta.env.PUBLIC_API_URL;

import { Message } from "./message";
import { SubjectController } from "./subject_controller";
import { SessionController } from "./session_controller";

class ChatController {
  private chat_button_: HTMLButtonElement;
  private chat_container_: HTMLElement;
  private chat_input_: HTMLInputElement;
  private getting_answer_: boolean = false;
  private input_div_: HTMLElement;
  private session_controller_: SessionController;
  private subject_controller_: SubjectController;

  constructor(
    chat_container_tag: string,
    input_div_tag: string,
    chat_input_tag: string,
    chat_button_tag: string,
    subject_selector_tag: string,
    menu_selector_tag: string,
    modal_search_tag: string,
    modal_list_selector_tag: string
  ) {
    this.chat_container_ = document.querySelector(
      chat_container_tag
    ) as HTMLElement;
    this.input_div_ = document.querySelector(input_div_tag) as HTMLElement;
    this.chat_input_ = document.querySelector(
      chat_input_tag
    ) as HTMLInputElement;
    this.chat_button_ = document.querySelector(
      chat_button_tag
    ) as HTMLButtonElement;
    this.subject_controller_ = new SubjectController(
      subject_selector_tag,
      menu_selector_tag,
      modal_search_tag,
      modal_list_selector_tag
    );

    this.Init();

    this.session_controller_ = new SessionController();

    if (!this.session_controller_.GetJwt()) {
      window.location.href = "/set_api_key";
    }
  }

  private AddClassToChooseSubject() {
    let actual_subject = this.subject_controller_.GetSelectedSubject();
    let subject = document.querySelector(
      "." + actual_subject.replace(/ /g, "_")
    ) as HTMLElement;
    if (subject) {
      subject.classList.add(
        "bg-[#a3bcff]",
        "selected_subject",
        "rounded-lg"
      );
    }
  }

  private AddMessage(message: Message) {
    this.AddMessageToChat(message);
    this.AddMessageToLocalStorage(message);
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

  private ClearQuestion() {
    this.chat_input_.value = "";
  }

  private GetQuestion() {
    let question = this.chat_input_.value;
    return question;
  }

  private async GetQuestionAnswer(): Promise<string> {
    // Desactiva el botón de enviar mensaje mientras se obtiene la respuesta y ponemos este
    // <span class="loading loading-spinner loading-sm"></span> en el botón
    this.chat_button_.innerHTML = '<span class="loading loading-spinner loading-sm"></span>';

    let question = this.GetQuestion();
    this.ClearQuestion();
    // adapta question para que sea compatible con la URL
    question = question.replace(/ /g, "%20");
    let url = "";
    let subject = this.subject_controller_.GetSelectedSubject();
    let jwt = this.session_controller_.GetJwt();
    
    // desactiva el botón de enviar mensaje
    this.chat_button_.disabled = true;

    if (subject != "Reglamentacion y Normativa") {
      url =
        API_URL + "/get_answer" +
        "?question=" +
        question +
        "&subject=" +
        subject;
    } else {
      url =
        API_URL + "/get_regulation_answer" +
        "?question=" +
        question;
    }

    let res;
    let data;
    try {
      this.getting_answer_ = true;
      res = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          'Authorization': jwt
        }
      });
      data = await res.json();
      data = data.answer;
    } catch (error) {
      console.error("Error:", error);
      if (res!.status == 401) {
        alert("La sesión ha expirado, por favor, introduce de nuevo la clave de la API");
        this.session_controller_.RemoveJwt();
        window.location.href = "/set_api_key";
      }
      data = "Error al obtener respuesta";
    }
    // activa el botón de enviar mensaje
    this.chat_button_.disabled = false;
    this.getting_answer_ = false;
    this.chat_button_.innerHTML = "Enviar";
    return data;
  }

  private LoadChatFromLocalStorage() {
    this.input_div_.style.display = "block";
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
    } else {
      let message = new Message("Hola, ¿en qué puedo ayudarte?", false);
      this.AddMessage(message);
    }
  }

  private RemoveClassToSubjects() {
    let subject = document.querySelector(".selected_subject") as HTMLElement;
    if (subject) {
      subject.classList.remove("bg-[#a3bcff]", "selected_subject");
    }
  }

  public Init() {
    this.chat_button_.addEventListener("click", async () => {
      if (this.getting_answer_) {
        return;
      }
      let question = this.GetQuestion();
      if (question == "") {
        return;
      }
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
        this.chat_container_.scrollTo({
          top: this.chat_container_.scrollHeight,
          behavior: "smooth",
        });
        this.RemoveClassToSubjects();
        this.AddClassToChooseSubject();
      });

      // esconde el input y carga un mensaje de bienvenida
      this.input_div_.style.display = "none";
      let message = new Message("Hola, soy ChatULL, tu asistente virtual.<br>Para comenzar, selecciona una asignatura de las mostradas en el menú de la izquierda, si no te aparece la asignatura que buscas, puedes darle al botón de crear nuevo chat y buscarla.<br><br><b>¡Importante!</b> Como asistente virtual, no guardo contexto de preguntas anteriores, así que para asegurar que las respuestas sean lo más precisas posibles realiza preguntas individuales. Evite formular cuestiones sobre varios apartados de las Guías Docentes o la reglamentación al mismo tiempo.", false);
      this.AddMessageToChat(message);
  }
}

export { ChatController };
let API_URL = import.meta.env.PUBLIC_API_URL; // URL de la API

// Clase para controlar las asignaturas
class SubjectController {
  private existing_chat_subjects_: string[] = []; // Chats existentes
  private menu_selector_: HTMLElement; // Selector del menú lateral
  private modal_list_selector_: HTMLUListElement; // Lista de asignaturas en el modal
  private modal_search_: HTMLInputElement; // Input de búsqueda de asignaturas
  private subject_selector_: HTMLInputElement; // Selector de asignaturas
  private subjects_: string[] = []; // Asignaturas

  /**
   * Constructor de la clase
   * @param subject_selector_tag Tag del input de la asignatura
   * @param menu_selector_tag Tag del selector del menú lateral
   * @param modal_search_tag Tag del input de búsqueda de asignaturas
   * @param modal_list_selector_tag Tag de la lista de asignaturas
   * @returns void
   */
  constructor(subject_selector_tag: string, menu_selector_tag: string, modal_search_tag: string, modal_list_selector_tag: string) {
    this.subject_selector_ = document.querySelector(
      subject_selector_tag
    ) as HTMLInputElement;
    this.menu_selector_ = document.querySelector(
      menu_selector_tag
    ) as HTMLElement;
    this.modal_search_ = document.querySelector(
      modal_search_tag
    ) as HTMLInputElement;
    this.modal_list_selector_ = document.querySelector(
      modal_list_selector_tag
    ) as HTMLUListElement;

    this.Init();
  }

  /**
   * Método para obtener las asignaturas del servidor
   * @returns Promise<string[]>
   */
  private async GetSubjectsFromServer(): Promise<string[]> {
    let res;
    let data = [];
    let url = API_URL + "/documents";
    try {
      res = await fetch(url);
      data = await res.json();
      data = data.map((doc: any) => doc.name);
    } catch (error) {
      console.log(error);
    }
    return data;
  }

  /**
   * Método para cargar los chats existentes
   * @returns void
   */
  private LoadExistingChatSubjects() {
    let chats = JSON.parse(localStorage.getItem("chats") || "{}");
    this.existing_chat_subjects_ = Object.keys(chats);
  }

  /**
   * Método para cargar los chats existentes en el menú lateral
   * @returns void
   */
  private LoadExistingChatSubjectsToLateralMenu() {
    let newChatButton = document.createElement("label");
    newChatButton.textContent = "Crear nuevo chat";
    newChatButton.classList.add("btn", "bg-[#5C068C]", "text-white", "hover:bg-[#4A056C]", "p-2", "rounded-md", "cursor-pointer", "m-4");
    newChatButton.htmlFor = "modal_crear_chat";

    this.menu_selector_.appendChild(newChatButton);
    let title = document.createElement("h1");
    title.textContent = "Asignaturas";
    title.classList.add("text-2xl", "font-bold", "p-4");
    this.menu_selector_.appendChild(title);
    
    this.existing_chat_subjects_.forEach((subject) => {
      this.LoadSubjectsToLateralMenu(subject);
    });
  }

  /**
   * Método para cargar las asignaturas
   * @returns void
   */
  private async LoadSubjects() {
    let subjects = await this.GetSubjectsFromServer();
    this.subjects_ = subjects;
  }

  /**
   * Método para carga una asignatura en el menú lateral
   * @param subject Asignatura
   * @returns void
   */
  private LoadSubjectsToLateralMenu(subject: string) {
    let subjectElement = document.createElement("li");
    let subjectElementAnchor = document.createElement("a");
    subjectElementAnchor.textContent = subject;
    subjectElementAnchor.href = "#" + subject;
    subjectElement.appendChild(subjectElementAnchor);
    subjectElement.addEventListener("click", () => {
      this.subject_selector_.value = subject;
      this.subject_selector_.dispatchEvent(new Event('change'));
    });
    let subjectText = subject.replace(/ /g, "_");
    subjectElement.classList.add("cursor-pointer", "hover:bg-gray-200", subjectText);
    this.menu_selector_.appendChild(subjectElement);
  }

  /**
   * Método para cargar las asignaturas en el modal
   * @returns void
   */
  private LoadSubjectsToModalList() {
    this.modal_list_selector_.innerHTML = "";
    let subjects = this.SearchSubject(this.modal_search_.value || "");
    let totalSubjects = subjects.length;

    subjects.forEach((subject) => {
      let subjectElement = document.createElement("li");
      let subjectElementAnchor = document.createElement("a");
      subjectElementAnchor.textContent = subject;
      subjectElementAnchor.href = "#" + subject;
      subjectElement.appendChild(subjectElementAnchor);
      subjectElement.addEventListener("click", () => {
        // si la asignatura ya existe en el chat, no la agrega
        if (!this.existing_chat_subjects_.includes(subject)) {
          this.LoadSubjectsToLateralMenu(subject);
          this.existing_chat_subjects_.push(subject);
        } 

        // cerrar modal modal_crear_chat es el id del checkbox
        let modal = document.getElementById("modal_crear_chat") as HTMLInputElement;
        modal.checked = false;
        
        this.subject_selector_.value = subject;
        this.subject_selector_.dispatchEvent(new Event('change'));
        
        this.modal_search_.value = "";
        this.modal_list_selector_.innerHTML = "";
        this.modal_list_selector_.style.display = "none";

        //desplazar el scroll a donde se encuentra la asignatura
        let subjectElement = document.querySelector("." + subject.replace(/ /g, "_")) as HTMLElement;
        subjectElement.scrollIntoView({behavior: "smooth"});
      });
      subjectElement.classList.add("cursor-pointer", "hover:bg-gray-300", "p-2", "m-2", "border", "border-2", "border-black", "rounded-lg", "text-center");
      this.modal_list_selector_.appendChild(subjectElement);
    });

    if (totalSubjects > 0) {
      this.modal_list_selector_.style.display = "block";
    } else {
      this.modal_list_selector_.style.display = "none";
    }

    if (totalSubjects > 3) {
      this.modal_list_selector_.style.height = "200px";
      this.modal_list_selector_.style.overflowY = "scroll";
    } else {
      this.modal_list_selector_.style.height = "auto";
      this.modal_list_selector_.style.overflowY = "auto";
    }
  }

  /**
   * Método para buscar asignaturas
   * @param subject Asignatura
   * @returns string[]
   */
  private SearchSubject(subject: string) {
    if (subject === "") {
      return this.subjects_;
    }
    return this.subjects_.filter((s) => s.toLowerCase().includes(subject.toLowerCase()));
  }

  /**
   * Método para obtener la asignatura seleccionada
   * @returns void
   */
  public GetSelectedSubject() {
    return this.subject_selector_.value;
  }

  /**
   * Método para obtener el selector de asignaturas
   * @returns HTMLInputElement
   */
  public GetSubjectSelector() {
    return this.subject_selector_;
  }

  /**
   * Método para inicializar la clase
   * @returns void
   */
  public async Init() {
    await this.LoadSubjects();
    this.LoadExistingChatSubjects();
    this.LoadExistingChatSubjectsToLateralMenu();
    this.LoadSubjectsToModalList();

    // cuando modal search cambia de valor
    this.modal_search_.addEventListener("input", () => {
      this.LoadSubjectsToModalList();
    });
  }
}

export { SubjectController };
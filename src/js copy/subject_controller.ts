class SubjectController {
  constructor(subject_selector_tag: string, menu_selector_tag: string) {
    this.subject_selector_ = document.querySelector(
      subject_selector_tag
    ) as HTMLInputElement;
    this.menu_selector_ = document.querySelector(
      menu_selector_tag
    ) as HTMLElement;

    this.Init();
  }

  public Init() {
    this.LoadSubjects();
    this.LoadExistingChatSubjects();
    this.LoadExistingChatSubjectsToLateralMenu();
  }

  public GetSubjectSelector() {
    return this.subject_selector_;
  }

  public GetSelectedSubject() {
    return this.subject_selector_.value;
  }

  private async GetSubjectsFromServer(): Promise<string[]> {
    let res;
    let data = [];
    try {
      res = await fetch("https://chatull.onrender.com/documents");
      data = await res.json();
      data = data.map((doc: any) => doc.name);
    } catch (error) {
      console.log(error);
    }
    return data;
  }

  private async LoadSubjects() {
    let subjects = await this.GetSubjectsFromServer();
    this.subjects_ = subjects;
  }

  private LoadExistingChatSubjects() {
    let chats = JSON.parse(localStorage.getItem("chats") || "{}");
    this.existing_chat_subjects_ = Object.keys(chats);
  }

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
    });
  }

  private subject_selector_: HTMLInputElement;
  private menu_selector_: HTMLElement;
  private subjects_: string[] = [];
  private existing_chat_subjects_: string[] = [];
}

export { SubjectController };

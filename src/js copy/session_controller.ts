class SessionController {
  constructor(session_input_tag: string = "", session_button_tag: string = "") {
    if (session_input_tag === "" || session_button_tag === "") {
        this.session_input_ = document.createElement("input");
        this.session_button_ = document.createElement("button");
        return;
    }
    this.session_input_ = document.querySelector(
      session_input_tag
    ) as HTMLInputElement;
    this.session_button_ = document.querySelector(
      session_button_tag
    ) as HTMLButtonElement;
  }

  public Init() {
    this.session_button_.addEventListener("click", () => {
        this.setApiKey();
    });

    this.session_input_.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.session_button_.click();
      }
    });
  }
  
  private IsValidApiKey(api_key: string) {
    let result = true;
    if (!this.api_key_regex_.test(api_key)) {
        result = false;
    }
    return result;
  }
  
  private async setApiKey() {
    let api_key = this.session_input_.value;
    console.log("api_key", api_key);
    // Validar que la API key tenga el formato correcto "sk-[48 letras o numeros en minúsculas o mayúsculas]"
    if (!this.IsValidApiKey(api_key)) {
      alert("La API key ingresada no es una API key válida");
      this.session_input_.value = "";
      return;
    }

    // Enviar la API key y el token de sesión al servidor (puedes usar fetch u otras opciones)
    await fetch("https://chatull.onrender.com/set_api_key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: api_key,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let sessionToken = data.session_token;
        // Guardar el token de sesión en el almacenamiento local
        this.SetSessionTokenToLocalStorage(sessionToken);
        window.location.href = "/chat2";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public GetSessionToken() {
    return sessionStorage.getItem("session_token") || "";
  }

  public SetSessionTokenToLocalStorage(token: string) {
    sessionStorage.setItem("session_token", token);
  }

  private session_input_: HTMLInputElement;
  private session_button_: HTMLButtonElement;
  private api_key_regex_ = /^sk-[a-zA-Z0-9]{48}$/;
}

export { SessionController };

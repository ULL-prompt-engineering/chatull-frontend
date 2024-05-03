let API_URL = import.meta.env.PUBLIC_API_URL;

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
  
  private async setApiKey() {
    // Cambiar el texto del botón a "Cargando..."
    this.session_button_.innerText = "Cargando...";
    
    let api_key = this.session_input_.value;

    let url = API_URL + "/set_api_key";
    // Enviar la API key al servidor para obtener el token JWT
    await fetch(url, {
      method: "POST",
      mode: "cors",
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
        let jwt = data.jwt;
        // Guardar el token JWT en el almacenamiento local
        this.SetJwtToLocalStorage(jwt);
        window.location.href = "/chat";
      })
      .catch((error) => {
        console.error(error);
        alert("Error con la API key, ponga una API key válida y vuelva a intentarlo");
        this.session_button_.innerText = "Registrar API-Key";
      });
  }

  public GetJwt() {
    return localStorage.getItem("jwt") || "";
  }

  public SetJwtToLocalStorage(jwt: string) {
    localStorage.setItem("jwt", jwt);
  }

  public RemoveJwt() {
    localStorage.removeItem("jwt");
  }

  private session_input_: HTMLInputElement;
  private session_button_: HTMLButtonElement;
}

export { SessionController };

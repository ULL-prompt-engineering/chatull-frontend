let API_URL = import.meta.env.PUBLIC_API_URL; // URL de la API

// Clase para controlar la sesión del usuario
class SessionController {
  private session_button_: HTMLButtonElement; // Botón para iniciar sesión
  private session_input_: HTMLInputElement; // Input para la API key

  /**
   * Constructor de la clase
   * @param session_input_tag Tag del input de la API key
   * @param session_button_tag Tag del botón de iniciar sesión
   * @returns void
   */
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

  /**
   * Método para enviar la API key al servidor y obtener el token JWT
   * @returns void
   */
  private async SetApiKey() {
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

  /**
   * Método para obtener el token JWT del almacenamiento local
   * @returns string
   */
  public GetJwt() {
    return localStorage.getItem("jwt") || "";
  }

  /**
   * Método para inicializar el controlador de sesión
   * @returns void
   */
  public Init() {
    this.session_button_.addEventListener("click", () => {
        this.SetApiKey();
    });

    this.session_input_.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.session_button_.click();
      }
    });
  }

  public RemoveJwt() {
    localStorage.removeItem("jwt");
  }

  public SetJwtToLocalStorage(jwt: string) {
    localStorage.setItem("jwt", jwt);
  }
}

export { SessionController };
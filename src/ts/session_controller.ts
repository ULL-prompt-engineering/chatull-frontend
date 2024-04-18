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
  
  private IsValidApiKey(api_key: string) {
    // Implementa la lógica de validación del token JWT aquí
    // Por ejemplo, puedes verificar el formato del token o enviar una solicitud al servidor para validar el token
    // Para este ejemplo, supondré que el token es válido si no está vacío
    return api_key.trim() !== "";
  }
  
  private async setApiKey() {
    // Verifica si ya existe un JWT en el almacenamiento local
    const existingJwt = this.GetJwt();
    if (existingJwt) {
      // Si ya hay un JWT, redirige al usuario a la página de chat
      window.location.href = "/chat";
      return;
    }
    
    let api_key = this.session_input_.value;
    console.log("api_key", api_key);
    // Validar que la API key tenga el formato correcto (aquí puedes agregar tu lógica de validación específica para los tokens JWT)
    if (!this.IsValidApiKey(api_key)) {
      alert("La API key ingresada no es una API key válida");
      this.session_input_.value = "";
      return;
    }
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
      });
  }

  public GetJwt() {
    return localStorage.getItem("jwt") || "";
  }

  public SetJwtToLocalStorage(jwt: string) {
    localStorage.setItem("jwt", jwt);
  }

  private session_input_: HTMLInputElement;
  private session_button_: HTMLButtonElement;
}

export { SessionController };

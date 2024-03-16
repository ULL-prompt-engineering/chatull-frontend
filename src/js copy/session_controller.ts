class SessionController {
    constructor() {
        this.sessionToken = localStorage.getItem("sessionToken") || "";
    }
    
    public GetSessionToken() {
        return this.sessionToken;
    }
    
    public SetSessionToken(token: string) {
        this.sessionToken = token;
        localStorage.setItem("sessionToken", token);
    }

    private sessionToken: string;
}

export { SessionController };
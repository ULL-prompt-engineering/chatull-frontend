function setApiKey() {
    // Capturar la API key ingresada por el usuario
    let apiKey = document.querySelector('input.api-key');

    // Enviar la API key y el token de sesión al servidor (puedes usar fetch u otras opciones)
    fetch('http://localhost:5000/set_api_key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            api_key: apiKey.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let sessionToken = data.session_token;
        sessionStorage.setItem('session_token', sessionToken);
    })
    .catch(error => {
        console.error(error);
    });

    // redirigir a la página principal
    window.location.href = 'chat';
}

document.querySelector('button.send-api-key').addEventListener('click', setApiKey);

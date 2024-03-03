async function setApiKey() {
    // Capturar la API key ingresada por el usuario
    let apiKey = document.querySelector('input.api-key');

    // Validar que la API key tenga el formato correcto "sk-[48 letras o numeros en minúsculas o mayúsculas]"
    let apiKeyRegex = /^sk-[a-zA-Z0-9]{48}$/;
    if (!apiKeyRegex.test(apiKey.value)) {
        alert('La API key ingresada no es una API key válida');
        apiKey.value = '';
        return;
    }

    // Enviar la API key y el token de sesión al servidor (puedes usar fetch u otras opciones)
    await fetch('https://chatull.onrender.com/set_api_key', {
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

    // Redirigir a la página de chat
    window.location.href = '/chat';
}

document.querySelector('button.send-api-key').addEventListener('click', setApiKey);

document.querySelector('span.api-link').addEventListener('click', () => {
    window.location.href = 'https://platform.openai.com/account/api-keys';
});
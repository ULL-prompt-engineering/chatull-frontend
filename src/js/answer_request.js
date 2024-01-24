import { loadQuestion } from './load_questions.js';

function obtenerRespuesta(input, selector, button) {
  button.disabled = true;
  button.innerHTML = "Obteniendo respuesta...";
  let question = input.value;
  input.value = "";
  // adapta question para que sea compatible con la URL
  question = question.replace(/ /g, "%20");
  let url = "";
  let sessionToken = sessionStorage.getItem('session_token');
  let actualSubject = selector.value;
  if (selector.value != "Reglamentación y Normativa") {
      url = 'http://127.0.0.1:5000/get_answer/' + sessionToken + '?question=' + question + '&subject=' + actualSubject;
  } else {
      url = 'http://127.0.0.1:5000/get_teacher_answer/' + sessionToken + '?question=' + question;
  }
  loadQuestion({"question": question.replace(/%20/g, " ")}, true);
  input.scrollIntoView();
  fetch(url)
  .then(response => response.json())
  .then(data => {
      let questionObject = {
            "question": question.replace(/%20/g, " "),
            "answer": data.answer
        };
      
        let questions = JSON.parse(localStorage.getItem(actualSubject));
        questions.push(questionObject);
        localStorage.setItem(actualSubject, JSON.stringify(questions));
        console.log(selector.value, actualSubject);
        if (selector.value === actualSubject) {
            loadQuestion(questionObject, false);
            input.scrollIntoView();
        }
        
        button.disabled = false;
        button.innerHTML = "Enviar";
  })
  .catch(error => {
      console.error('Error:', error);
      button.disabled = false;
      button.innerHTML = "Enviar";
      loadQuestion({"answer": "Error al obtener respuesta."}, false);
  });
}

// Encuentra todos los botones con la clase `alert` en la página.
const button = document.querySelector('button.question');
const input = document.querySelector('input.input-question');
const selector = document.querySelector('input.subject');
// Maneja los clics en cada botón.

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }
});

button.addEventListener('click', async() => {
    obtenerRespuesta(input, selector, button);
});



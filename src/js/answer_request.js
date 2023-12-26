import { loadQuestion } from './load_questions.js';

function obtenerRespuesta(answer, input, selector, button) {
  button.disabled = true;
  button.innerHTML = "Obteniendo respuesta...";
  let question = input.value;
  input.value = "";
  // adapta question para que sea compatible con la URL
  question = question.replace(/ /g, "%20");
  let url = "";
  if (selector.value != "Reglamentación y Normativa") {
      url = 'http://127.0.0.1:5000/get_answer?question=' + question + '&subject=' + selector.value;
  } else {
      url = 'http://127.0.0.1:5000/get_teacher_answer?question=' + question;
  }
  loadQuestion({"question": question.replace(/%20/g, " ")}, true);
  input.scrollIntoView();
  fetch(url)
  .then(response => response.json())
  .then(data => {
      console.log(data);
      answer.innerHTML = data.answer;
      let questionObject = {
            "question": question.replace(/%20/g, " "),
            "answer": data.answer
        };
      if (!localStorage.getItem(selector.value) || localStorage.getItem(selector.value) == "null") {
            localStorage.setItem(selector.value, JSON.stringify([questionObject]));
      } else {
            let questions = JSON.parse(localStorage.getItem(selector.value));
            questions.push(questionObject);
            localStorage.setItem(selector.value, JSON.stringify(questions));
      }
        loadQuestion(questionObject, false);
        input.scrollIntoView();
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
const answer = document.querySelector('div.answer');
const selector = document.querySelector('select.subject');
// Maneja los clics en cada botón.

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }
});

button.addEventListener('click', async() => {
    obtenerRespuesta(answer, input, selector, button);
});



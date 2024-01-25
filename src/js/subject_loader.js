import { loadQuestion } from './load_questions.js';

document.addEventListener('click', function(event) {
    let optionsList = document.querySelector('ul.optionsList');

    // Si el clic no ocurrió dentro de la lista, oculta la lista
    if (!optionsList.contains(event.target)) {
        optionsList.style.display = 'none';
    }
});

async function searchHandler() {
    let searchTerm = document.querySelector('input.search').value.toLowerCase();
    let optionsList = document.querySelector('ul.optionsList');
    optionsList.innerHTML = '';

    let data = localStorage.getItem('subjects');
    data = JSON.parse(data);

    let matchingResults = data.filter(function(result) {
        return result.toLowerCase().includes(searchTerm);
    });

    matchingResults.forEach(function(result) {
        let listItem = document.createElement('li');
        listItem.textContent = result;
        // add styling to the list item
        listItem.classList.add('border', 'border-gray-400', 'rounded', 'py-2', 'px-4', 'cursor-pointer', 'hover:bg-gray-700', 'hover:text-white');            
        optionsList.appendChild(listItem);
    });

    // Mostrar la lista de opciones
    if (matchingResults.length > 0) {
        optionsList.style.display = 'block';
    } else {
        optionsList.style.display = 'none';
    }

    if (matchingResults.length > 3) {
        optionsList.style.height = '200px';
        optionsList.style.overflowY = 'scroll';
    } else {
        optionsList.style.height = 'auto';
        optionsList.style.overflowY = 'auto';
    }
}

async function SaveSubjectsToLocalStorage() {
    let res
    let data = [];
     try {
        res = await fetch('http://127.0.0.1:5000/documents')
        data = await res.json()
        data = data.map(doc => doc.name)
    } catch (error) {
        console.log(error)
    }

    localStorage.setItem('subjects', JSON.stringify(data));

    loadQuestion({"answer": "¡Hola! Soy ChatUll, tu asistente virtual. Primero, selecciona la Guía Docente sobre la que quieres preguntar a través del buscador situado en la esquina inferior derecha de la pantalla."}, false);
}

function selectHandler(event) {
    let selectedOption = event.target.textContent;
    document.querySelector('input.search').value = selectedOption;
    document.querySelector('input.subject').value = selectedOption;
    document.querySelector('ul.optionsList').style.display = 'none';
    document.querySelector('button.question').style.display = 'block';
    document.querySelector('input.input-question').style.display = 'block';
    document.querySelector('button.clear').style.display = 'block';

    let questions = localStorage.getItem(selectedOption);
    
    document.querySelector("div.chat-container").innerHTML = "";
    
    if (questions) {
        questions = JSON.parse(questions);
        questions.forEach((question) => {
            if (question.question === "") {
                loadQuestion(question, false);
            } else {
                loadQuestion(question, true);
                loadQuestion(question, false);
            }
        });
    } else {
        let introductoryMessage = "¡Hola! Soy ChatUll, tu asistente virtual. Puedes preguntarme cualquier duda que tengas sobre el documento seleccionado.";

        let questionObject = {
            "question": "",
            "answer": introductoryMessage
        };
        localStorage.setItem(selectedOption, JSON.stringify([questionObject]));
        loadQuestion(questionObject, false);
    }
}

SaveSubjectsToLocalStorage()

let searchInput = document.querySelector('input.search');
searchInput.addEventListener('input', searchHandler);

let optionsList = document.querySelector('ul.optionsList');
optionsList.addEventListener('click', selectHandler);

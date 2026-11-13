// ===================================
// JAVASCRIPT - CENTRAL DE SUPORTE DOACÃO
// ===================================

// Capturando os elementos HTML
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");

const questions = document.querySelectorAll(".faq-item");
const cards = document.querySelectorAll(".help-card");

const noResults = document.querySelector("#no-results");

// Função para normalizar o texto da pesquisa
function normalizeText(text) {
    return text
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Função principal de pesquisa
function filterHelp(term) {

    const query = normalizeText(term.trim());

    let visibleQuestions = 0;
    let visibleCards = 0;

    // Filtrando perguntas frequentes
    questions.forEach((item) => {

        const text = normalizeText(
            item.textContent + " " +
            (item.dataset.keywords || "")
        );

        const match = !query || text.includes(query);

        item.hidden = !match;

        if (match) {
            visibleQuestions++;
        }

    });

    // Filtrando cartões de ajuda
    cards.forEach((card) => {

        const text = normalizeText(
            card.textContent + " " +
            (card.dataset.keywords || "")
        );

        const match = !query || text.includes(query);

        card.hidden = !match;

        if (match) {
            visibleCards++;
        }

    });

    // Mensagem quando não existem resultados
    noResults.hidden =
        visibleQuestions > 0 || visibleCards > 0;

}

// Quando o usuário pesquisar
form.addEventListener("submit", (event) => {

    event.preventDefault();

    filterHelp(input.value);

    document.querySelector("#ajuda").scrollIntoView({
        behavior: "smooth"
    });

});

// Pesquisa enquanto o usuário digita
input.addEventListener("input", () => {

    filterHelp(input.value);

});

// Inicialização da página
filterHelp("");

console.log("JavaScript do DOACÃO carregado!");

// ==========================================
// CARROSSEL DE ANIMAIS
// ==========================================

const janelaCarrossel = document.querySelector(".janela-carrossel");

if (janelaCarrossel) {

    const trilho = janelaCarrossel.querySelector(".trilho-carrossel");

    if (trilho) {

        const cartoes = Array.from(trilho.children);
        const botaoAnterior = document.querySelector(".seta-carrossel.anterior");
        const botaoProximo = document.querySelector(".seta-carrossel.proximo");
        const indicador = document.querySelector(".indicador-carrossel");

        let posicao = 0;
        let intervaloCarrossel;
        let quantidadeVisivel = 3;

        function atualizarCarrossel() {

            if (cartoes.length === 0) return;

            const larguraCartao = cartoes[0].getBoundingClientRect().width;
            const estilosTrilho = getComputedStyle(trilho);
            const espacamento = parseFloat(estilosTrilho.gap) || 0;

            if (window.innerWidth <= 560) {
                quantidadeVisivel = 1;
            } else if (window.innerWidth <= 800) {
                quantidadeVisivel = 2;
            } else {
                quantidadeVisivel = 3;
            }

            const ultimaPosicao = Math.max(
                0,
                cartoes.length - quantidadeVisivel
            );

            posicao = Math.min(posicao, ultimaPosicao);

            trilho.style.transform =
                `translateX(-${posicao * (larguraCartao + espacamento)}px)`;

            if (indicador) {
                indicador.textContent =
                    `${posicao + 1} de ${ultimaPosicao + 1}`;
            }
        }

        function proximoAnimal() {

            const ultimaPosicao = Math.max(
                0,
                cartoes.length - quantidadeVisivel
            );

            posicao = posicao >= ultimaPosicao ? 0 : posicao + 1;

            atualizarCarrossel();
        }

        function animalAnterior() {

            const ultimaPosicao = Math.max(
                0,
                cartoes.length - quantidadeVisivel
            );

            posicao = posicao <= 0 ? ultimaPosicao : posicao - 1;

            atualizarCarrossel();
        }

        function iniciarRotacao() {

            clearInterval(intervaloCarrossel);

            if (cartoes.length > quantidadeVisivel) {
                intervaloCarrossel = setInterval(proximoAnimal, 4000);
            }
        }

        if (botaoProximo) {
            botaoProximo.addEventListener("click", function() {
                proximoAnimal();
                iniciarRotacao();
            });
        }

        if (botaoAnterior) {
            botaoAnterior.addEventListener("click", function() {
                animalAnterior();
                iniciarRotacao();
            });
        }

        window.addEventListener("resize", function() {
            atualizarCarrossel();
            iniciarRotacao();
        });

        atualizarCarrossel();
        iniciarRotacao();
    }
}


// ==========================================
// PRÉ-VISUALIZAÇÃO DA FOTO DO ANIMAL
// ==========================================

const campoFoto = document.querySelector("#foto-animal");
const previewFoto = document.querySelector("#preview-foto");
const textoPreview = document.querySelector("#texto-preview");

if (campoFoto && previewFoto && textoPreview) {

    campoFoto.addEventListener("change", function() {

        const arquivo = campoFoto.files[0];

        if (arquivo && arquivo.type.startsWith("image/")) {

            const leitor = new FileReader();

            leitor.onload = function() {
                previewFoto.src = leitor.result;
                previewFoto.style.display = "block";
                textoPreview.style.display = "none";
            };

            leitor.readAsDataURL(arquivo);

        } else {

            previewFoto.removeAttribute("src");
            previewFoto.style.display = "none";
            textoPreview.style.display = "block";
        }
    });
}


// ==========================================
// PRÉ-VISUALIZAÇÃO DA FOTO DO ITEM
// ==========================================

const fotoItem = document.querySelector("#foto-item");
const previewItem = document.querySelector("#preview-item");
const textoPreviewItem = document.querySelector("#texto-preview-item");

if (fotoItem && previewItem && textoPreviewItem) {

    fotoItem.addEventListener("change", function() {

        const arquivo = fotoItem.files[0];

        if (arquivo && arquivo.type.startsWith("image/")) {

            const leitor = new FileReader();

            leitor.onload = function() {
                previewItem.src = leitor.result;
                previewItem.style.display = "block";
                textoPreviewItem.style.display = "none";
            };

            leitor.readAsDataURL(arquivo);

        } else {

            previewItem.removeAttribute("src");
            previewItem.style.display = "none";
            textoPreviewItem.style.display = "block";
        }
    });
}


// ==========================================
// VALIDAÇÃO DO FORMULÁRIO DE DOAÇÃO DE ANIMAL
// ==========================================

const formularioAnimal = document.querySelector(
    ".cadastro-animal .formulario-cadastro"
);

const mensagem = document.querySelector("#mensagem-cadastro");

if (formularioAnimal && mensagem && campoFoto) {

    formularioAnimal.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!formularioAnimal.checkValidity()) {
            formularioAnimal.reportValidity();
            return;
        }

        const arquivo = campoFoto.files[0];

        if (!arquivo || !arquivo.type.startsWith("image/")) {
            mensagem.textContent =
                "Selecione uma imagem válida do animal.";

            mensagem.style.color = "#B3261E";
            return;
        }

        const tamanhoMaximo = 5 * 1024 * 1024;

        if (arquivo.size > tamanhoMaximo) {
            mensagem.textContent =
                "A imagem deve ter no máximo 5 MB.";

            mensagem.style.color = "#B3261E";
            return;
        }

        mensagem.textContent =
            "Cadastro validado com sucesso! 🐾";

        mensagem.style.color = "#3F6748";
    });
}


// ==========================================
// 1. CARROSSEL DE ANIMAIS
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
// 2. PRÉ-VISUALIZAÇÃO DA FOTO DO ANIMAL
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
// 3. PRÉ-VISUALIZAÇÃO DA FOTO DO ITEM
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
// 4. CADASTRO E ARMAZENAMENTO DOS ANIMAIS
// ==========================================

const formularioAnimal = document.querySelector(
    ".cadastro-animal .formulario-cadastro"
);

const mensagem = document.querySelector("#mensagem-cadastro");

if (formularioAnimal && mensagem && campoFoto) {

    formularioAnimal.addEventListener("submit", function(event) {

        event.preventDefault();

        // Verifica se todos os campos obrigatórios foram preenchidos

        if (!formularioAnimal.checkValidity()) {
            formularioAnimal.reportValidity();
            return;
        }

        const arquivo = campoFoto.files[0];

        // Verifica se existe uma foto válida

        if (!arquivo || !arquivo.type.startsWith("image/")) {

            mensagem.textContent =
                "Selecione uma imagem válida do animal.";

            mensagem.style.color = "#B3261E";
            return;
        }

        // Limite de tamanho da foto: 1,5 MB
        // O localStorage possui espaço limitado.

        const tamanhoMaximo = 1.5 * 1024 * 1024;

        if (arquivo.size > tamanhoMaximo) {

            mensagem.textContent =
                "A imagem deve ter no máximo 1,5 MB.";

            mensagem.style.color = "#B3261E";
            return;
        }

        // Lê a imagem e transforma em texto

        const leitor = new FileReader();

        leitor.onload = function() {

            // Captura os dados preenchidos no formulário

            const novoAnimal = {
                id: Date.now(),
                nome: document.querySelector("#nome").value,
                especie: document.querySelector("#especie").value,
                idade: document.querySelector("#idade").value,
                sexo: document.querySelector("#sexo").value,
                porte: document.querySelector("#porte").value,
                cidade: document.querySelector("#cidade").value,
                saude: document.querySelector("#saude").value,
                descricao: document.querySelector("#descricao").value,
                contato: document.querySelector("#contato").value,
                foto: leitor.result
            };

            try {

                // Recupera os animais já cadastrados

                let animais = JSON.parse(
                    localStorage.getItem("animaisDOACAO")
                ) || [];

                // Adiciona o novo animal

                animais.push(novoAnimal);

                // Salva novamente no navegador

                localStorage.setItem(
                    "animaisDOACAO",
                    JSON.stringify(animais)
                );

                mensagem.textContent =
                    "Animal cadastrado com sucesso! 🐾";

                mensagem.style.color = "#3F6748";

                // Limpa o formulário

                formularioAnimal.reset();

                // Limpa a pré-visualização da foto

                previewFoto.removeAttribute("src");
                previewFoto.style.display = "none";
                textoPreview.style.display = "block";

            } catch (erro) {

                mensagem.textContent =
                    "Não foi possível salvar o cadastro. Verifique o espaço disponível no navegador.";

                mensagem.style.color = "#B3261E";

                console.error("Erro ao salvar animal:", erro);
            }
        };

        leitor.onerror = function() {

            mensagem.textContent =
                "Não foi possível carregar a foto do animal.";

            mensagem.style.color = "#B3261E";
        };

        leitor.readAsDataURL(arquivo);
    });
}

// ==========================================
// 5. CENTRAL DE SUPORTE DOACÃO
// ==========================================

// Capturando os elementos HTML

const formPesquisa = document.querySelector("#search-form");
const inputPesquisa = document.querySelector("#search-input");

const perguntas = document.querySelectorAll(".faq-item");
const cartoesAjuda = document.querySelectorAll(".help-card");

const semResultados = document.querySelector("#no-results");


// ==========================================
// 6. NORMALIZAÇÃO DO TEXTO DA PESQUISA
// ==========================================

function normalizeText(text) {

    return text
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// ==========================================
// 7. FILTRO DA CENTRAL DE SUPORTE
// ==========================================

function filterHelp(term) {

    const query = normalizeText(term.trim());

    let perguntasVisiveis = 0;
    let cartoesVisiveis = 0;

    // Filtrando perguntas frequentes

    perguntas.forEach(function(item) {

        const texto = normalizeText(
            item.textContent + " " +
            (item.dataset.keywords || "")
        );

        const corresponde = !query || texto.includes(query);

        item.hidden = !corresponde;

        if (corresponde) {
            perguntasVisiveis++;
        }
    });


    // Filtrando cartões de ajuda

    cartoesAjuda.forEach(function(cartao) {

        const texto = normalizeText(
            cartao.textContent + " " +
            (cartao.dataset.keywords || "")
        );

        const corresponde = !query || texto.includes(query);

        cartao.hidden = !corresponde;

        if (corresponde) {
            cartoesVisiveis++;
        }
    });


    // Mensagem quando não existem resultados

    if (semResultados) {

        semResultados.hidden =
            perguntasVisiveis > 0 || cartoesVisiveis > 0;
    }
}


// ==========================================
// 8. EVENTOS DA PESQUISA
// ==========================================

if (formPesquisa && inputPesquisa) {

    // Pesquisa ao enviar o formulário

    formPesquisa.addEventListener("submit", function(event) {

        event.preventDefault();

        filterHelp(inputPesquisa.value);

        const secaoAjuda = document.querySelector("#ajuda");

        if (secaoAjuda) {
            secaoAjuda.scrollIntoView({
                behavior: "smooth"
            });
        }
    });


    // Pesquisa enquanto o usuário digita

    inputPesquisa.addEventListener("input", function() {

        filterHelp(inputPesquisa.value);
    });


    // Inicialização da pesquisa

    filterHelp("");
}


// ==========================================
// 9. MENSAGEM DE INICIALIZAÇÃO
// ==========================================

console.log("JavaScript do DOACÃO carregado com sucesso!");


 
 // ==========================================
 // 10. EXIBIR E REMOVER ANIMAIS DA ADOÇÃO
 // ==========================================

const listaAnimais = document.querySelector("#lista-animais");

if (listaAnimais) {

    function carregarAnimais() {

        listaAnimais.innerHTML = "";

        let animais = [];

        try {
            animais = JSON.parse(
                localStorage.getItem("animaisDOACAO")
            ) || [];
        } catch (erro) {
            console.error("Erro ao recuperar animais:", erro);
        }

        if (animais.length === 0) {
            listaAnimais.textContent =
                "Ainda não temos animais cadastrados para adoção.";
            return;
        }

        animais.forEach(function(animal) {

            const cartao = document.createElement("article");
            cartao.classList.add("cartao-adocao");

            // Foto
            const foto = document.createElement("img");
            foto.src = animal.foto;
            foto.alt = "Foto de " + animal.nome;

            // Nome
            const nome = document.createElement("h3");
            nome.textContent = animal.nome;

            // Espécie
            const especie = document.createElement("p");
            especie.textContent =
                animal.especie === "cachorro" ? "Cachorro" : "Gato";

            // Idade
            const idade = document.createElement("p");
            idade.textContent = "Idade: " + animal.idade;

            // Sexo
            const sexo = document.createElement("p");
            sexo.textContent = "Sexo: " + animal.sexo;

            // Porte
            const porte = document.createElement("p");
            porte.textContent = "Porte: " + animal.porte;

            // Cidade
            const cidade = document.createElement("p");
            cidade.textContent = animal.cidade;

            // Botão conhecer pet
            const botao = document.createElement("button");
            botao.type = "button";
            botao.textContent = "Conhecer pet";

            // ABRIR DETALHES DO ANIMAL
            botao.addEventListener("click", function() {

                document.querySelector("#modal-foto").src = animal.foto;
                document.querySelector("#modal-foto").alt =
                    "Foto de " + animal.nome;

                document.querySelector("#modal-nome").textContent =
                    animal.nome;

                document.querySelector("#modal-especie").textContent =
                    "Espécie: " + animal.especie;

                document.querySelector("#modal-idade").textContent =
                    "Idade: " + animal.idade;

                document.querySelector("#modal-sexo").textContent =
                    "Sexo: " + animal.sexo;

                document.querySelector("#modal-porte").textContent =
                    "Porte: " + animal.porte;

                document.querySelector("#modal-cidade").textContent =
                    "Cidade: " + animal.cidade;

                document.querySelector("#modal-saude").textContent =
                    "Saúde: " + animal.saude;

                document.querySelector("#modal-descricao").textContent =
                    "Descrição: " + animal.descricao;

                document.querySelector("#modal-contato").textContent =
                    "Contato: " + animal.contato;

                document.querySelector("#modal-animal").style.display = "flex";
            });

            // Botão remover cadastro
            const botaoRemover = document.createElement("button");
            botaoRemover.type = "button";
            botaoRemover.textContent = "Remover cadastro";
            botaoRemover.classList.add("botao-remover");

            botaoRemover.addEventListener("click", function() {

                const confirmar = confirm(
                    "Tem certeza que deseja remover " +
                    animal.nome + " do cadastro?"
                );

                if (confirmar) {

                    const animaisAtualizados = animais.filter(
                        function(item) {
                            return item.id !== animal.id;
                        }
                    );

                    try {
                        localStorage.setItem(
                            "animaisDOACAO",
                            JSON.stringify(animaisAtualizados)
                        );

                        carregarAnimais();

                    } catch (erro) {
                        alert("Não foi possível remover o cadastro.");
                        console.error(erro);
                    }
                }
            });

            // Adiciona os elementos ao cartão
            cartao.appendChild(foto);
            cartao.appendChild(nome);
            cartao.appendChild(especie);
            cartao.appendChild(idade);
            cartao.appendChild(sexo);
            cartao.appendChild(porte);
            cartao.appendChild(cidade);
            cartao.appendChild(botao);
            cartao.appendChild(botaoRemover);

            listaAnimais.appendChild(cartao);

        });
    }

    // Carrega os animais ao abrir a página
    carregarAnimais();
}


// ==========================================
// 11. ABRIR E FECHAR JANELA DO ANIMAL
// ==========================================

const modalAnimal = document.querySelector("#modal-animal");
const fecharModal = document.querySelector("#fechar-modal");

if (modalAnimal && fecharModal) {

    // Fechar pelo botão X
    fecharModal.addEventListener("click", function() {
        modalAnimal.style.display = "none";
    });

    // Fechar clicando fora do conteúdo
    modalAnimal.addEventListener("click", function(event) {
        if (event.target === modalAnimal) {
            modalAnimal.style.display = "none";
        }
    });

    // Fechar apertando a tecla ESC
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            modalAnimal.style.display = "none";
        }
    });
}

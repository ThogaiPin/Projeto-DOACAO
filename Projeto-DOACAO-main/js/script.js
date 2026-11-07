
const janelaCarrossel = document.querySelector(".janela-carrossel");

if (janelaCarrossel) {

    const trilho = janelaCarrossel.querySelector(".trilho-carrossel");
    const cartoes = Array.from(trilho.children);
    const botaoAnterior = document.querySelector(".seta-carrossel.anterior");
    const botaoProximo = document.querySelector(".seta-carrossel.proximo");
    const indicador = document.querySelector(".indicador-carrossel");

    let posicao = 0;
    let intervaloCarrossel;
    let quantidadeVisivel = 3;

    function atualizarCarrossel() {

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

        const ultimaPosicao = Math.max(0, cartoes.length - quantidadeVisivel);
        posicao = Math.min(posicao, ultimaPosicao);

        trilho.style.transform =
            `translateX(-${posicao * (larguraCartao + espacamento)}px)`;

        indicador.textContent = `${posicao + 1} de ${ultimaPosicao + 1}`;
    }

    function proximoAnimal() {

        const ultimaPosicao = Math.max(0, cartoes.length - quantidadeVisivel);
        posicao = posicao >= ultimaPosicao ? 0 : posicao + 1;
        atualizarCarrossel();

    }

    function animalAnterior() {

        const ultimaPosicao = Math.max(0, cartoes.length - quantidadeVisivel);
        posicao = posicao <= 0 ? ultimaPosicao : posicao - 1;
        atualizarCarrossel();

    }

    function iniciarRotacao() {

        clearInterval(intervaloCarrossel);
        intervaloCarrossel = setInterval(proximoAnimal, 4000);

    }

    botaoProximo.addEventListener("click", () => {

        proximoAnimal();
        iniciarRotacao();

    });

    botaoAnterior.addEventListener("click", () => {

        animalAnterior();
        iniciarRotacao();
        
    });

    window.addEventListener("resize", atualizarCarrossel);

    atualizarCarrossel();
    iniciarRotacao();
}

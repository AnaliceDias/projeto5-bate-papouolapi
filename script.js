let nomeDoUsuario = {name: prompt("Informe seu nome de usuário:")};
console.log(nomeDoUsuario);

function confirmarPresencaDoUsuario(){
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nomeDoUsuario);
    requisicao.then(
        function(){
            console.log("O usuário permanece na sala")
        }
    )
    requisicao.catch(
        function(){
            console.log("Erro ao enviar requisição de presença")
        }
    )

}

function processarCadastro(resultado){
    console.log(resultado.status);
    if(resultado.status === 200){
        setInterval(buscarMensagens,3000);
        setInterval(confirmarPresencaDoUsuario,5000);

        return
    }else {
        nomeDoUsuario = {name: prompt("Este nome já está em uso. Informe um novo nome de usuário:")};
    }
}

function cadastrarUsuario(){

    let requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", nomeDoUsuario);
    requisicao.then(processarCadastro);
    requisicao.catch(processarCadastro);
}

function exibirMensagens(resultado){
    let mensagens = resultado.data;
    let main = document.querySelector("main");
    main.innerHTML = "";
    
    for(let i=0; i< mensagens.length; i++){
        if(mensagens[i].type === "status"){
            main.innerHTML+= `
            <div class="entrouOuSaiuDaSala" data-identifier="message">
            <p class="textoDaMensagem">
                <span class="horario">(${mensagens[i].time})</span>
                <strong class="usuario">${mensagens[i].from}</strong>
                <span class="textoDaMensagem">${mensagens[i].text}</span>
            </p>
        </div> 
            `
        }else if (mensagens[i].type === "message" && mensagens[i].to === "Todos"){
            main.innerHTML+=`
            <div class="mensagemPublica" data-identifier="message">
            <p>
                <span class="horario">(${mensagens[i].time})</span>
                <strong class="usuario">${mensagens[i].from}</strong>
                <span>para</span>
                <strong class="destinatario">${mensagens[i].to}</strong>
                <span class="textoDaMensagem">${mensagens[i].text}</span>

            </p>
        </div> 
            `
        }else if (mensagens[i].type === "private_message" && (mensagens[i].to === nomeDoUsuario.name || mensagens[i].from === nomeDoUsuario.name)){
            main.innerHTML+=`
            <div class="mensagemPrivada" data-identifier="message">
            <p>
                <span class="horario">(${mensagens[i].time})</span>
                <strong class="usuario">${mensagens[i].from}</strong>
                <span>para</span>
                <strong class="destinatario">${mensagens[i].to}</strong>
                <span class="textoDaMensagem">${mensagens[i].text}</span>

            </p>
        </div> 
            `
        }
        
    }

    let elementoVisivel = main.lastElementChild;
    elementoVisivel.scrollIntoView();
    
}

function buscarMensagens(){
    let requisicao = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    requisicao.then(exibirMensagens);
    requisicao.catch(
        function(){
            console.log("Erro ao tentar carregar as mensagens");
        }
    );
}

cadastrarUsuario()
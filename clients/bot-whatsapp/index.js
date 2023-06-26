
const { Client } = require("whatsapp-web.js")
const QRCodeTerminal = require("qrcode-terminal")
const fetch = require("node-fetch")

const defaultConfig = {
    puppeteer: {
        headless: false,
        defaultViewport: null
    },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
}
const client = new Client(defaultConfig)

// Capturo o evento de QRCode para apresentá-lo no terminal.
client.on("qr", (qrCode) => {
    QRCodeTerminal.generate(qrCode, { small: true })
})

// Inicializo o bot WhatsApp
client.initialize()

// Lista de perguntas necessárias para preencher o cadastro...
const questions = [
    "Qual é o seu nome?",
    "Qual é o seu sobrenome?",
    "Qual é o seu CPF?",
    "Qual é a sua data de nascimento?",
    "Qual é o seu gênero?",
    "Qual é o seu RG?",
    "Qual é o órgão emissor do seu RG?",
    "Qual é a UF do seu RG?",
    "Qual é o seu CEP?",
    "Qual é a sua cidade?",
    "Qual é o seu logradouro?",
    "Qual é o seu estado?",
    "Qual é o seu número?",
    "Qual é o seu complemento?",
    "Qual é o seu telefone?",
    "Qual é o seu celular?",
    "Qual é o seu trabalho?",
    "Qual é o seu email?"
]
// Lista de resposta capturadas no cadastro
const answers = []

// Evento de captura de mensagens do WhatsApp
client.on("message", async function signUp(messageWhatsApp) {
    // Se capturar a mensagem "cadastrar" inicia as pergunta do bot.
    if(messageWhatsApp.body.toLowerCase() == "cadastrar") {
        // Mensagem de boas vindas
        messageWhatsApp.reply("Olá aqui é o chatbot da VMD, vamos iniciar seu cadastro?!")
        // Indice das perguntas começando pela primeira, ou seja, a posição 0 do array 
        let questionIndex = 0
        // Enquanto houver perguntas ele irá...
        while(questionIndex < questions.length) {
            // Apresentar mensagem com a pergunta do bot a partir do indice
            messageWhatsApp.reply(questions[questionIndex])
            // Armazenar a mensagem de reposta do usuário na lista de respostas
            answers.push(await getAnswer())
            // Atualizar o indice para próxima pergunta
            questionIndex += 1
        }
        // Nomeando, em ordem os valores em variáveis que utilizaremos para gerar requisição do cadastro
        const [      
            nome,
            sobrenome,
            cpf,
            nascimento,
            genero,
            numeroRG,
            emissorRG,
            ufRG,
            cep,
            cidade,
            logradouro,
            estado,
            numero,
            complemento,
            telefone,
            celular,
            trabalho,
            email
        ] = answers

        await fetch("http://localhost:1234/cadastrar", {
                headers: {
                    "Content-Type": "application/json",
                },
              method: "POST",
              body: JSON.stringify({
                nome,
                sobrenome,
                cpf,
                nascimento,
                genero,
                rg: {
                  numero: numeroRG,
                  emissor: emissorRG,
                  uf: ufRG,
                },
                endereco: {
                  cep,
                  cidade,
                  logradouro,
                  estado,
                  numero,
                  complemento,
                },
                contatos: {
                  telefone,
                  celular,
                  trabalho,
                  email,
                },
            })
        })
            
        client.off("message", signUp)
    }
})

function getAnswer() {
    return new Promise((resolve) => {
        client.on("message", function getUserMessage(currentAnswer) {
            client.off("message", getUserMessage)
            resolve(currentAnswer.body)
        })
    })
}
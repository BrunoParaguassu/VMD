const Inquirer = require("inquirer");
const fetch = require("node-fetch");

Inquirer.prompt([
    {
      type: "list",
      name: "start",
      message: "Vamos iniciar seu cadastro aqui na VMD?",
      choices: ["Sim", "Não"],
    },
  ])
  .then((answers) => {
    if (answers.start === "Sim") {
      Inquirer.prompt([

        {
          type: "input",
          name: "nome",
          message: "Qual é o seu nome?",
        },
        {
          type: "input",
          name: "sobrenome",
          message: "Qual é seu sobrenome?",
        },
        {
          type: "number",
          name: "cpf",
          message: "Qual é o seu CPF?",
        },
        {
          type: "number",
          name: "nascimento",
          message: "Qual é a sua data de nascimento?",
        },
        {
          type: "list",
          name: "genero",
          message: "Qual é o seu gênero?",
          choices: ["Masculino", "Feminino", "outro"],
        },
        {
          type: "number",
          name: "rg",
          message: "Qual é o seu número de RG?",
        },
        {
          type: "input",
          name: "orgao",
          message: "Qual é o órgão emissor do seu RG?",
        },
        {
          type: "input",
          name: "UF",
          message: "Qual é o estado emissor do seu RG?",
        },
        {
          type: "number",
          name: "CEP",
          message: "Qual é o seu CEP?",
        },
        {
          type: "input",
          name: "cidade",
          message: "Qual é a sua cidade?",
        },
        {
          type: "input",
          name: "rua",
          message: "Qual é o seu logradouro?",
        },
        {
          type: "input",
          name: "estado",
          message: "Qual é o seu estado?",
        },
        {
          type: "number",
          name: "numero",
          message: "Qual é o número da sua residência?",
        },
        {
          type: "input",
          name: "complemento",
          message: "Qual é o complemento da sua residência?",
        },
        {
          type: "number",
          name: "telefone",
          message: "Qual é o seu telefone?",
        },
        {
          type: "number",
          name: "celular",
          message: "Qual é o seu celular?",
        },
        {
          type: "number",
          name: "trabalho",
          message: "Qual é o seu telefone do trabalho?",
        },
        {
          type: "input",
          name: "email",
          message: "Qual é o seu e-mail?",
        },
        
        ]).then(async (answers) => {
          try {
            await fetch("http://localhost:1234/cadastrar", {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                nome: answers.nome,
                sobrenome: answers.sobrenome,
                cpf: answers.cpf,
                nascimento: answers.nascimento,
                genero: answers.genero,
                rg: {
                  numero: answers.rg,
                  emissor: answers.orgao,
                  uf: answers.UF,
                },
                endereco: {
                  cep: answers.CEP,
                  cidade: answers.cidade,
                  logradouro: answers.rua,
                  estado: answers.estado,
                  numero: answers.numero,
                  complemento: answers.complemento,
                },
                contatos: {
                  telefone: answers.telefone,
                  celular: answers.celular,
                  trabalho: answers.trabalho,
                  email: answers.email,
                },
              }),
            });

            Inquirer.prompt([
              {
                type: "message",
                name: "sucesseMessage",
                message: "Olá, seu cadastro foi realizado com sucesso",
              },
            ]);
          } catch {
            Inquirer.prompt([
              {
                type: "message",
                name: "errorMessage",
                message: "Não foi possível realizar o cadastro",
              },
            ]);
          }
        });
    } else {
      Inquirer.prompt([
        {
          type: "message",
          name: "byeMessage",
          message: "Tudo bem, até a próxima. Obrigado!",
        },
      ]);
    }
  });

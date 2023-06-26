const { body, validationResult } = require("express-validator")
const { database, person, rgs, addresses, contacts } = require("./database")

const signUp = async (request, response) => {

    console.log(request.body)
    const { nome, sobrenome, cpf, nascimento, genero, rg, endereco, contatos } = request.body
    const t = await database.transaction()

    try {
        const newPerson = await person.create({ 
            nome, 
            sobrenome, 
            cpf, 
            nascimento, 
            genero
        }, { transaction: t })
        
        await rgs.create({
            numero: rg.numero,
            emissor: rg.emissor,
            uf: rg.uf,
            UsuarioId: newPerson.id
        }, { transaction: t })
        
        await addresses.create({
            cep: endereco.cep,
            cidade: endereco.cidade,
            logradouro: endereco.logradouro,
            estado: endereco.estado,
            numero: endereco.numero,
            complemento: endereco.complemento,
            UsuarioId: newPerson.id
        }, { transaction: t })

        await contacts.create({
            telefone: contatos.telefone,
            celular: contatos.celular,
            trabalho: contatos.trabalho,
            email: contatos.email,
            UsuarioId: newPerson.id
        }, { transaction: t })

        t.commit()
    
        response.status(201).json({ id: newPerson.id, nome: newPerson.nome })
    } 
    catch(error) {
        await t.rollback()

        response.status(500).json(error)
    }
}

const validateSignUp = [

    body("rg.numero")
        .notEmpty()
        .withMessage("Número de RG é obrigatório.")
        .isNumeric()
        .withMessage("Número do RG deve ser um valor numérico.")
        .matches(/^\d{7}$/)
        .withMessage("Número de RG inválido."),

    body("rg.emissor")
        .notEmpty()
        .withMessage("Emissor de RG é obrigatório.")
        .isAlpha()
        .withMessage("Emissor de RG deve ser um valor alfabético.")
        .isLength({ min: 2, max: 2 })
        .withMessage("Emissor de RG deve ter 2 caracteres.")
        .withMessage("Formato inválido para o órgão emissor do RG."),
      

    body("rg.uf")
        .notEmpty()
        .withMessage("UF de RG é obrigatório.")
        .isAlpha()
        .withMessage("UF de RG deve ser um valor alfabético.")
        .isLength({ min: 2, max: 2 })
        .withMessage("UF de RG deve ter 2 caracteres."),

    body("cpf")
        .notEmpty()
        .withMessage("Número de CPF é obrigatório.")
        .isNumeric()
        .withMessage("Número do CPF deve ser um valor numérico.")
        .matches(/^\d{11}$/)
        .withMessage("Número de CPF inválido."),

    body("nascimento")
        .notEmpty()
        .withMessage("Data de nascimento é obrigatório.")
        .isDate()
        .withMessage("Data de nascimento deve ser uma data válida."),

    body("genero")
        .notEmpty()
        .withMessage("Gênero é obrigatório.")
        .isAlpha()
        .withMessage("Gênero deve ser um valor alfabético.")
        .isLength({ min: 1, max: 1 })
        .withMessage("Gênero deve ter 1 caractere."),

    body("endereco.cep")
        .notEmpty()
        .withMessage("CEP é obrigatório.")
        .isNumeric()
        .withMessage("CEP deve ser um valor numérico.")
        .matches(/^\d{8}$/)
        .withMessage("CEP inválido."),

    body("endereco.cidade")
        .notEmpty()
        .withMessage("Cidade é obrigatório.")
        .isAlpha()
        .withMessage("Cidade deve ser um valor alfabético."),

    body("endereco.logradouro")
        .notEmpty()
        .withMessage("Logradouro é obrigatório.")
        .isAlpha()
        .withMessage("Logradouro deve ser um valor alfabético."),

    body("endereco.estado")
        .notEmpty()
        .withMessage("Estado é obrigatório.")
        .isAlpha()
        .withMessage("Estado deve ser um valor alfabético.")
        .isLength({ min: 2, max: 2 })
        .withMessage("Estado deve ter 2 caracteres."),

    body("endereco.numero")
        .optional()
        .isNumeric()
        .withMessage("Número deve ser um valor numérico."),

    body("endereco.complemento")
        .optional()
        .isAlpha()
        .withMessage("Complemento deve ser um valor alfabético."),

    body("contatos.telefone")
        .optional()
        .isNumeric()
        .withMessage("Telefone deve ser um valor numérico."),

    body("contatos.celular")
        .optional()
        .isNumeric()
        .withMessage("Celular deve ser um valor numérico."),

    body("contatos.trabalho")
        .optional()
        .isNumeric()
        .withMessage("Telefone do trabalho deve ser um valor numérico."),

    body("contatos.email")
        .optional()
        .isEmail()
        .withMessage("Email deve ser um valor válido."),

    (request, response, next) => {

        const erros = !validationResult(request).isEmpty()

        if (erros) {
            response
                .status(400)
                .json(erros.array())
        }
        else {
            next()
        }
        
    }
]

module.exports = { signUp, validateSignUp }
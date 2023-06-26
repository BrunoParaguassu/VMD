const { Sequelize, DataTypes } = require("sequelize")

const database = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
})

database.sync()
  .then(() => console.log("sync!"))
  .catch((error) => console.error("Erro:", error))

const rgs = database.define("RG", {
    numero: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    emissor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
})

const addresses = database.define("Endereco", {
  cep: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logradouro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  complemento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

const contacts = database.define("Contatos", {
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trabalho: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
})

const person = database.define("Usuario", { 
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
})

person.hasOne(rgs)
person.hasOne(addresses)
person.hasOne(contacts)

module.exports = { database, person, rgs, addresses, contacts }
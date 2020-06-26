const { ApolloServer, gql } = require("apollo-server")
const resolvers = require("./db/resolvers")
const typeDefs = require("./db/schema");
const connectDB = require("./config/db")

// Conectamos a la DB
connectDB()

// Creamos el servidor
const server = new ApolloServer({ typeDefs, resolvers });

// inicializamos el servidor
server.listen().then(({ url }) => {
    console.log(`Servidor listo en ${url}`);
})
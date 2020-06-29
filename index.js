require("dotenv").config({ path: "variables.env" })
const { ApolloServer, gql } = require("apollo-server")
const jwt = require("jsonwebtoken")
const resolvers = require("./db/resolvers")
const typeDefs = require("./db/schema");
const connectDB = require("./config/db")

// Conectamos a la DB
connectDB()

// Creamos el servidor
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => {

        const token = req.headers["authorization"] || ""

        if( token ) 
            try {
                
                const user = jwt.verify(token, process.env.SECRET)

                return { 
                    user
                }

            } catch (error) {
                return null
            }

    }
});

// inicializamos el servidor
server.listen().then(({ url }) => {
    console.log(`Servidor listo en ${url}`);
})
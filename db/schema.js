const { gql } = require("apollo-server")

// Schema 
const typeDefs = gql`

    # Usuarios
    input UserInput {
        name: String!
        email: String!
        password: String!
    }

    input Login {
        email: String!
        password: String!
    }

    type Token {
        token: String
    }

    type Query {

        helloWorld: String
        
    }

    type Mutation {

        # Usuarios
        createUser(input: UserInput): String
        login(input: Login): Token

    }

`

module.exports = typeDefs
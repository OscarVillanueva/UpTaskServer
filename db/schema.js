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

    # Proyectos
    type Project {
        id: ID
        projectName: String
    }

    input ProjectInput {
        projectName: String!
    }

    type Query {

        # Proyectos
        getProjects: [Project]
        
    }

    type Mutation {

        # Usuarios
        createUser(input: UserInput): String
        login(input: Login): Token

        # Proyectos
        createProject(input: ProjectInput): Project
        updateProject(id: ID!, input: ProjectInput): Project
        deleteProject(id: ID!): String

    }

`

module.exports = typeDefs
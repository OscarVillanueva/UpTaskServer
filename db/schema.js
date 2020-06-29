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

    # Tarea
    type Task {
        id: ID
        taskName: String
        projectId: String
        state: Boolean
    }

    input TaskInput {
        taskName: String!
        projectId: String!
    }

    type Query {

        # Proyectos
        getProjects: [Project]

        # Tareas
        getTask(id: ID!): [Task]
        
    }

    type Mutation {

        # Usuarios
        createUser(input: UserInput): String
        login(input: Login): Token

        # Proyectos
        createProject(input: ProjectInput): Project
        updateProject(id: ID!, input: ProjectInput): Project
        deleteProject(id: ID!): String

        # Tareas
        createTask(input: TaskInput): Task
        updateTask(id: ID!, input: TaskInput, status: Boolean): Task
        deleteTask(id: ID! ): String

    }

`

module.exports = typeDefs
require("dotenv").config({ path: "variables.env" })
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Project = require("../models/Project")
const Task = require("../models/Task")

// Crear y firmar un JWT
const createToken = (user, secret, expiresIn) => {
    
    const { id, email } = user
    return jwt.sign({ id, email }, secret, { expiresIn })

}

// Resolvers
const resolvers = {
    Query: {
        
        getProjects: async (_, { }, ctx) => {
            if ( ctx && ctx.user) {

                const projects = await Project.find({ owner: ctx.user.id })

                return projects

            }
            else throw new Error("No autorizado")
        },

        getTask: async (_, { id }, ctx) => {
            
            if ( ctx && ctx.user) {

                const project = await Project.findById( id )

                if ( !project ) throw new Error("Proyecto no encontrado")

                // Revisar si el proyecto actual pertenece al usuario autenticado
                // Verificar el creador del projecto
                if( project.owner.toString() !== ctx.user.id ) throw new Error("No autorizado")
                 
                // Sacamos las tareas
                const tasks = await Task.find({ projectId: id })

                return tasks

            }
            else throw new Error("No autorizado")

        },

    },

    Mutation: {

        createUser: async (_, { input }) => {
            
            const { email, password } = input
            
            // Verificamos si existe el usuario
            const exists = await User.findOne({ email })

            // Si existe mandamos un error
            if ( exists ) throw new Error("El usuario ya esta registrado")

            try {
                
                // Creamos el usuario basado en el input
                const newUser = new User( input )

                // Salt para hashear
                const salt = await bcryptjs.genSalt(10)

                // Hasheamos la contraseña
                newUser.password = await bcryptjs.hash(password, salt)

                // Lo guardamos
                newUser.save()

                return "Usuario creado"

            } catch (error) {
                console.log(error);
            }

        },

        login: async (_, { input }) => {
            
            const { email, password } = input

            // Verificamos si existe el usuario
            const exists = await User.findOne({ email })

            // Si existe mandamos un error
            if ( !exists ) throw new Error("El usuario o contraseña no existen")

            // Revisamos que la contraseña sea correcta
            const correct = await bcryptjs.compare(password, exists.password)

            if ( !correct ) throw new Error("El usuario o contraseña no existen")

            // Damos acceso
            return {
                token: createToken(exists, process.env.SECRET, "24hr")
            }
        },

        // Proyectos
        createProject: async (_, { input }, ctx) => {
            
            if ( ctx && ctx.user) {

                try {
    
                    const project = new Project(input)
    
                    // Agregar el creador
                    project.owner = ctx.user.id

                    // almacenamos en la base de datos
                    const result = await project.save()
    
                    return result
                    
                } catch (error) {
                    console.log(error);
                }
            }
            else throw new Error("No autorizado")


        },

        updateProject: async (_, { id, input }, ctx) => {
            
            if ( ctx && ctx.user) {

                // Revisamos que el proyecto exista
                let project = await Project.findById( id )

                // Si no existe
                if ( !project ) throw new Error("Proyecto no encontrado")

                // Revisamos que el que edita es el creador
                if ( project.owner.toString()  !== ctx.user.id ) throw new Error("No autorizado")

                // Actualizamos
                project = await Project.findOneAndUpdate({ _id: id }, input, { new: true })

                return project

            }
            else throw new Error("No autorizado")

        },

        deleteProject: async (_, { id }, ctx) => {
            
            if ( ctx && ctx.user) {

                // Revisamos que el proyecto exista
                let project = await Project.findById( id )

                // Si no existe
                if ( !project ) throw new Error("Proyecto no encontrado")

                // Revisamos que el que edita es el creador
                if ( project.owner.toString()  !== ctx.user.id ) throw new Error("No autorizado")

                // Borramos
                await Project.findOneAndDelete({ _id: id })

                return "Proyecto eliminado"

            }
            else throw new Error("No autorizado")

        },

        // Tareas
        createTask: async (_, { input }) => {
            
            try {
                
                // Creamos la tarea
                const task = new Task(input)

                // Guardamos la tarea
                const result = await task.save()

                return result

            } catch (error) {
                console.log(error);
            }

        },

        updateTask: async (_, { id, input, status }, ctx) => {
            
            if ( ctx && ctx.user ) {

                const { taskName, projectId } = input

                try {

                    // Si la tarea existe o no
                    let isTarea = await Task.findById( id )
            
                    if( !isTarea ) throw new Error("Tarea no econtrada")
            
                    // Extraer proyecto
                    const project = await Project.findById( projectId )
            
                    // Revisar si el proyecto actual pertenece al usuario autenticado
                    // Verificar el creador del projecto
                    if( project.owner.toString() !== ctx.user.id ) throw new Error("No autorizado")

                    // Crear un objeto con la nueva información
                    const newTask = {}
                    newTask.taskName = taskName        
                    newTask.state = status 
                    
                    // Guardar la tarea
                    isTarea = await Task.findOneAndUpdate({ _id: id }, newTask, { new: true })
                    
                    return isTarea
            
                } catch (error) {
                    console.log(error);
                    throw new Error("Hubo un error")
                }

            }
            else throw new Error("No autorizado")
        },

        deleteTask: async (_, { id }, ctx) => {
            
            if ( ctx && ctx.user ) { 

                try {

                    // Si la tarea existe o no
                    let isTarea = await Task.findById( id )
            
                    if( !isTarea ) throw new Error("Tarea no encontrada")
            
                    // Extraer proyecto
                    const project = await Project.findById( isTarea.projectId )

                    // Revisar si el proyecto actual pertenece al usuario autenticado
                    // Verificar el creador del projecto
                    if(project.owner.toString() !== ctx.user.id) throw new Error("No autorizado")
            
                    // // Eliminar la tarea
                    await Task.findByIdAndRemove({_id: id})
                    
                    return "Tarea eliminada"
            
                } catch (error) {
                    console.log(error);
                }

            }
            else throw new Error("No autorizado")

        },

    }
}

module.exports = resolvers
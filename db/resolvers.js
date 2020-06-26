require("dotenv").config({ path: "variables.env" })
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Crear y firmar un JWT
const createToken = (user, secret, expiresIn) => {
    
    const { id, email } = user
    return jwt.sign({ id, email }, secret, { expiresIn })

}

// Resolvers
const resolvers = {
    Query: {
        
        helloWorld: () => { return "Hola Mundo!!" }

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

    }
}

module.exports = resolvers
import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from '../libs/jwt.js';

export const addUser = async (req, res) => {
    const {username, password, role} = req.body

    try{
        const userFound = await User.findOne({username})
        if(userFound) return res.status(400).json(['The username is already in use'])

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({username, password: hashedPassword, role})

        const userSaved = await newUser.save();

        res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            role: userSaved.role
        })
    }catch(error){
        res.status(400).json({ error: error.message });
    }

}
export const registerUser = async (req, res) => {
    const { username, password, role } = req.body
    
    try{
        const userFound = await User.findOne({username })
        if (userFound) 
            return res.status(400).json(['The username is already in use'])

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({username, password: hashedPassword, role})

        const userSaved = await newUser.save()
        const token = await createAccessToken({id: userSaved._id})

        res.cookie("token", token)
        res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            role: userSaved.role
        })

        

    }catch(error){
        res.status(400).json({error: error.message})
    }
}

export const login = async (req, res) => {
    const {username, password} = req.body

    try{
        const userFound = await User.findOne({username})
        if (!userFound) return res.status(400).json(["User not found"])
        const isMatch = await bcrypt.compare(password,userFound.password)
        if (!isMatch) return res.status(400).json(["Incorrect password"])

        const token = await createAccessToken({id: userFound._id})
        
        res.cookie("token", token)
        res.json({
            id: userFound._id,
            username: userFound.username,
            role: userFound.role
        })

    } catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const logout = (req,res) => {
    res.cookie('token', "", {
        expire: new Date(0),
    });
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)

    if(!userFound) return res.status(400).json({
        message: "User don found"
    })

    return res.json({
        id: userFound._id,
        username: userFound.username,
        role: userFound.role
    })
    
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message:"Unauthorized"})

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if(err) return res.status(401).json({ message:"Unauthorized"})

        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({ message:"Unauthorized"})

        return res.json ({
            id: userFound._id,
            username: userFound.username,
            role: userFound.role
        })
    })
}
export const getUser = async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)

    } catch (error) {
        return res.status(500).json({ message: "error al buscar los usuarios" })
    }
}

export const deleteUser = async (req, res) => {
    try {

        const deleteUser = await User.findByIdAndDelete(req.params.id)
        if (!deleteUser) return res.status(404).json({
            message: "Usuario no encontrado"
        })
        res.json({
            message: "Usuario eleminado exitosamente",
            deleteUser
        })

    } catch (error) {
        console.error('Error al eliminar usurio:', error)
        res.status(500).json({
            message: "Error al eliminar usuario"
        })
    }
}

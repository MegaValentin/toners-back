import Order from "../models/orders.model.js"
import Toners from "../models/toners.model.js"
import Areas from "../models/areas.model.js"

export const getOrders = async (req, res) =>{}

export const getOrder = async (req, res) =>{}

export const deleteOrder = async (req, res) =>{}

export const addOrders = async (req, res) =>{
    try{
        const { toner, cantidad, area } = req.body

        if (!toner || !cantidad || !area) {
            return res.status(400).json({
              message: "Los campos 'toner', 'cantidad' y 'area' son requeridos"
            });
        }

        const tonerExists = await Toners.findById(toner)
        const areaExists = await Areas.findById(area)
        
        if(!tonerExists){
            return res.status(404).json({
                message: "El toner especificado no existe"
            })
        }
        if(!areaExists){
            return res.status(404).json({
                message: "El toner especificado no existe"
            })
        }
        if (tonerExists.cantidad < cantidad){
            return res.status(400).json({
                message:"cantidad insuficiente de toner"
            })
        }

        const newOrder = new Order({ toner,
            tonerName: tonerExists.toner, 
            cantidad,
            area, 
            areaName: areaExists.area })

        const savedOrder = await newOrder.save()
            console.log(newOrder.tonerName);
        tonerExists.cantidad -= cantidad
        await tonerExists.save()

        res.status(201).json(savedOrder)
    }
    catch(error){
        console.error('Error al agregar la orden', error);
        res.status(500).json({
            message: "Error al agregar la orden"
        })
    }
}
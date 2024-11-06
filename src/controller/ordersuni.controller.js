import OrdersUni from "../models/ordersuni.model.js";
import UnidadImagen from "../models/unidadImagen.model.js";
import Areas from "../models/areas.model.js";


import dotenv from "dotenv";


dotenv.config();

export const getOrdersUni = async (req, res) => {
  try {
    const orderUni = await OrdersUni.find();
    res.json(orderUni);
  } catch (error) {
    return res.status(500).json({ message: "error al buscar las ordenes" });
  }
};

export const getOrderUni = async (req, res) => {
  try {
    const { id } = req.params;
    const orderUni = await OrdersUni.findById(id);

    if (!orderUni) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }
    res.json(orderUni);
  } catch (error) {
    console.error("Error al obtener la orden: ", error);
    res.status(500).json({
      message: "Error al obtener la orden",
    });
  }
};

export const deleteOrderUni = async (req, res) => {
  try {
    const deleteUniOrder = await OrdersUni.findByIdAndDelete(req.params.id);

    if (!deleteUniOrder)
      return res.status(404).json({
        message: "Orden no encontrada",
      });

    res.json({
      message: "Orden eliminada exitosamente",
      deleteUniOrder,
    });
  } catch (error) {
    console.error("Error al eliminar la orden: ", error);
    res.status(500).json({
      message: "Error al eliminar la orden",
    });
  }
};

export const deliveryUni = async (req, res) => {
  const { id } = req.params;

  try {
    const orderUni = await OrdersUni.findById(id);

    if (orderUni) {
      const uni = await UnidadImagen.findById(orderUni.uni);
      if (uni) {
        if (uni.cantidad < orderUni.cantidad) { 
          return res.status(400).json({
            message: "No hay suficiente cantidad de unidad de imagen",
          });
        }
        uni.cantidad -= orderUni.cantidad; 
        if (uni.cantidad < 0) {
          uni.cantidad = 0;
        }

        await uni.save();

        orderUni.isDelivered = true;
        await orderUni.save();

        res.status(200).json({
          message: "Order delivered and stock updated",
          orderUni,
        });
      } else {
        res.status(404).json({ message: "Unidad de imagen no encontrada" });
      }
    } else {
      res.status(404).json({
        message: "Orden no encontrada",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order and stock", error });
  }
};
export const addOrdersUni = async (req, res) => {
  try {
    const { uni, cantidad, area } = req.body;

    if (!uni || !cantidad || !area) {
      return res.status(400).json({
        message: "Todos los campos son requeridos",
      });
    }

    const uniExists = await UnidadImagen.findById(uni);
    const areaExists = await Areas.findById(area);

    if (!uniExists) {
      return res.status(404).json({
        message: "La Unidad de Imagen especificada no existe",
      });
    }
    if (!areaExists) {
      return res.status(404).json({
        message: "El area especificado no existe",
      });
    }

    const newOrderUni = new OrdersUni({
      uni,
      uniName: uniExists.unidadImagen,
      cantidad,
      area,
      areaName: areaExists.area,
    });

    console.log(newOrderUni);
    const savedOrderUni = await newOrderUni.save();
    await uniExists.save();

    res.status(201).json(savedOrderUni);
  } catch (error) {
    console.error("Error al agregar la orden", error);
    res.status(500).json({
      message: "Error al agregar la orden",
    });
  }
};

export const cancelOrderUni = async (req, res) => {
  const { id } = req.params

  try {
    const orderUni = await orderUni.findById(id)

    if(!orderUni) {
      return res.status(404).json({
        message: 'Order not found'
      })
    }

    if(!orderUni.isDelivered){
      return res.status(400).json({
        message: 'Order is not delivered, so it cannot be canceled'
      })
    }

    const uni = await UnidadImagen.findById(orderUni.uni)
    if(!uni){
      return res.status(404).json({
        message: 'Toner not found'
      })
    }

    uni.cantidad += orderUni.cantidad
    await uni.save()

  } catch (error) {

    console.error('Error canceling order and updating stock', error);
    res.status(500).json({ message: 'Error canceling order and updating stock', error });
  }
}

export const removeUndeliveredOrderUni = async(req, res) => {
  const { id } = req.params

  try {
    const order = await OrdersUni.findById(id)

    if(!order){
      return res.status(404).json({ message: 'Order not found'})

    }
    if(order.isDelivered) {
      return res.status(400).json({ message: 'Delivered orders cannot be deleted'})

    }

    await OrdersUni.findByIdAndDelete(id)
    res.status(200).json({ message: 'Error deleteting undeliverd'})
  } catch (error) {
    console.error("Error deleting undeleiverd order: ", error)
    res.status(500).json({ message: "Error deleting undelivered"})
  }
}
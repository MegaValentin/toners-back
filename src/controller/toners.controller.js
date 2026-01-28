import Toners from "../models/toners.model.js";
import xlsx from "xlsx";
import fs from "fs";
import excelJS from "exceljs";
import PDFDocument from "pdfkit";
import path from "path";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  Header,
  ImageRun,
} from "docx";

export const getToners = async (req, res) => {
  try {
    const toners = await Toners.find();
    res.json(toners);
  } catch (error) {
    return res.status(500).json({ message: "error al buscar El toner" });
  }
};

export const getToner = async (req, res) => {
  try {
    const { id } = req.params;
    const toner = await Toners.findById(id);

    if (!toner) {
      return res.status(404).json({
        message: "Toner no encontrada",
      });
    }

    res.json(toner);
  } catch (error) {
    console.error("Error al obtener el toner:", error);
    res.status(500).json({
      message: "Error al obtener el toner",
    });
  }
};

export const deleteToner = async (req, res) => {
  try {
    const deleteToner = await Toners.findByIdAndDelete(req.params.id);
    if (!deleteToner)
      return res.status(404).json({
        message: "Toner no encontrada",
      });
    res.json({
      message: "Toner eliminada exitosamente",
      deleteToner,
    });
  } catch (error) {
    console.error("Error al eliminar el toner:", error);
    res.status(500).json({
      message: "Error al eliminar el toner",
    });
  }
};

export const updatedToner = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, toner, cantidad } = req.body;

    if (!toner && cantidad === undefined && !marca) {
      return res.status(400).json({
        message: "El campor 'toner' y 'cantidad' son requeridos",
      });
    }

    const updatedToner = await Toners.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedToner) {
      return res.status(404).json({
        message: "Toner no encontrado",
      });
    }

    res.json(updatedToner);
  } catch (error) {
    console.error("Error al actualizar el toner:", error);
    res.status(500).json({
      message: "Error al actulizar el toner",
    });
  }
};

export const addToners = async (req, res) => {
  try {
    const { toner, cantidad, marca, cantidadIdeal } = req.body;

    if (
      !toner ||
      !marca ||
      cantidad === undefined ||
      cantidadIdeal === undefined
    ) {
      return res
        .status(400)
        .json({ message: "El nombre y la cantidad son requeridos" });
    }

    const normalizedToner = toner.trim().toLowerCase();
    // Busca si ya existe un toner con el nombre normalizado de forma insensible a mayúsculas/minúsculas
    const existingToner = await Toners.findOne({
      toner: { $regex: `^${normalizedToner}$`, $options: "i" },
    });

    if (existingToner) {
      existingToner.cantidad += cantidad;
      const updatedToner = await existingToner.save();
      res.status(200).json(updatedToner);
    } else {
      const newToner = new Toners({ marca, toner, cantidad, cantidadIdeal });
      const savedToner = await newToner.save();
      res.status(201).json(savedToner);
    }
  } catch (error) {
    console.log("Error al agregar el toner", error);
    res.status(500).json({ message: "Error al agregar el toner." });
  }
};

export const postReStock = async (req, res) => {
  try {
    const { tonerId, cantidad } = req.body;

    if (!tonerId || !cantidad || cantidad <= 0) {
      return res
        .status(400)
        .json({ message: "El ID del toner y la cantidad son requeridos" });
    }

    const toner = await Toners.findById(tonerId);
    if (!toner) {
      return res.status(404).json({ message: "Toner no encontrado" });
    }

    toner.cantidad += cantidad;
    await toner.save();

    res.status(200).json({ message: "toner reabastecido exitosamente", toner });
  } catch (error) {
    console.error("Error en el restock de toner: ", error);
    res.status(500).json({ message: "Error en el restock de toner:" });
  }
};

export const restockAllPost = async (req, res) => {
  try {
    const { restocks } = req.body;

    if (!restocks || !Array.isArray(restocks)) {
      return res.status(400).json({ message: "Invalid restock data" });
    }

    const updatePromise = restocks.map(async (restock) => {
      const toner = await Toners.findById(restock.tonerId);

      if (toner) {
        toner.cantidad += restock.cantidad;
        toner.alert = toner.cantidad <= 1;
        await toner.save();
      }
    });

    await Promise.all(updatePromise);
    res
      .status(200)
      .json({ message: "Restock completed successfully", restocks });
  } catch (error) {
    console.error("Error in restock", error);
    res.status(500).json({ message: "Error in restock" });
  }
};

export const addAllToners = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file upload" });
  }

  try {
    const book = xlsx.readFile(file.path);
    const sheetName = book.SheetNames[0];
    const worksheet = book.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const newToner = data.map((row) => ({
      marca: row.Marca,
      toner: row.Toner,
      cantidad: row.Cantidad || 0,
    }));

    await Toners.insertMany(newToner);

    fs.unlinkSync(file.path);

    res.status(201).json({ message: "Stock creado desde el archivo Excel" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const reportToners = async (req, res) => {
  try {
    const toners = await Toners.find();

    if (!toners || toners.length === 0) {
      return res.status(404).json({ message: "No toner data available" });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Current Stock Report");

    // Agregar encabezados
    worksheet.columns = [
      { header: "Marca", key: "marca", width: 25 },
      { header: "Toner", key: "toner", width: 25 },
      { header: "Stock", key: "cantidad", width: 25 },
    ];

    // Agregar filas de datos
    toners.forEach((toner) => {
      worksheet.addRow({
        marca: toner.marca,
        toner: toner.toner,
        cantidad: toner.cantidad,
      });
    });

    // Configurar el archivo para su descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=current_stock_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error generating current stock report:", error);
    res.status(500).json({ message: "Error generating current stock report" });
  }
};

export const docRecommendedTonersOrders = async (req, res) => {
  try {
    const toners = await Toners.find();

    if (!toners || toners.length === 0) {
      return res.status(404).json({ message: "No toner data available" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Pedido_Toners.pdf"
    );
    doc.pipe(res);
    doc.image(path.resolve("../logoReporte.jpg"), {
      fit: [150, 150],
      align: "center",
      valign: "top",
    });
    doc.moveDown(3);
    doc.fontSize(12);
    const formattedDate = format(new Date(), "d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
    doc.text(`Bolivar, ${formattedDate}`, {
      align: "right",
    });
    doc.moveDown(1);
    doc.text("Jefe de Compras", {
      align: "left",
    });
    doc.text("Sra. Pia Pavia", {
      align: "left",
    });
    doc.text("Municipalidad de Bolivar", {
      align: "left",
    });
    doc.moveDown(1);
    doc.text("Tengo el agrado de dirigirme a Ud, a fin de solicitarle.", {
      align: "right",
    });
    doc.moveDown();
    doc.fontSize(10);
    const tableTop = doc.y;
    const rowHeight = 18;
    const startX = 90;
    const colMarcaW = 80;
    const colTonersW = 230;
    const colPedidoRecoW = 80;
    const colMarcaX = startX;
    const colTonersX = colMarcaX + colMarcaW;
    const colPedidoRecoX = colTonersX + colTonersW;

    let rowIndex = 0;
    toners.forEach((toner) => {
      const pedidoRecomendado = Math.max(
        toner.cantidadIdeal - toner.cantidad,
        0
      );
      if (pedidoRecomendado === 0) return;
      const y = tableTop + rowIndex * rowHeight;
      doc.rect(colMarcaX, y, colMarcaW, rowHeight).stroke();
      doc.rect(colTonersX, y, colTonersW, rowHeight).stroke();
      doc.rect(colPedidoRecoX, y, colPedidoRecoW, rowHeight).stroke();
      doc.text(toner.marca, colMarcaX + 5, y + 7, {
        width: colMarcaW,
        align: "left",
      });
      doc.text(toner.toner, colTonersX + 5, y + 7, {
        width: colTonersW,
        align: "left",
      });
      doc.text(pedidoRecomendado.toString(), colPedidoRecoX, y + 7, {
        width: colPedidoRecoW,
        align: "center",
      });
      rowIndex++;
    });

    doc.y = tableTop + toners.length * rowHeight + 10;
    doc.x = doc.page.margins.left;

    const paddingAfterTable = 6;
    doc.y = tableTop + rowIndex * rowHeight + paddingAfterTable;
    console.log(doc.y);

    doc.fontSize(12);
    doc.moveDown(2);
    doc.text(
      "Los toners seran utilizados en las diferentes areas del municipio",
      { align: "left" }
    );
    doc.moveDown(1);
    doc.text(
      "Sin otro particular aprovecho la oportunidad para saludarlo atte",
      { align: "right" }
    );
    doc.moveDown(1);
    doc.text("Departamento de Informatica");
    doc.end();
  } catch (error) {
    console.error("ERROR PDF:", error);
    res.status(500).json({ message: "Error generando el PDF" });
  }
};

export const docRecommendedTonersOrdersWord = async (req, res) => {
  try {
    const toners = await Toners.find();
    if (!toners || toners.length === 0) {
      return res.status(404).json({ message: "No toner data available" });
    }
    const tonersConPedido = toners
      .map((t) => ({
        marca: t.marca,
        toner: t.toner,
        pedido: Math.max(t.cantidadIdeal - t.cantidad, 0),
      }))
      .filter((t) => t.pedido > 0);
    const formattedDate = format(new Date(), "d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Arial",
              size: 24, 
            },
          },
        },
      },

      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: fs.readFileSync(
                        path.resolve("../logoReporte.jpg")
                      ),
                      alignment: AlignmentType.RIGHT,
                      transformation: {
                        width: 120,
                        height: 60,
                      },
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `Bolivar, ${formattedDate}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph(""),
            new Paragraph("Jefe de Compras"),
            new Paragraph("Sra. Pia Pavia"),
            new Paragraph("Municipalidad de Bolivar"),
            new Paragraph(""),
            new Paragraph({
              text: "Tengo el agrado de dirigirme a Ud, a fin de solicitarle.",
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph(""),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: ["Marca", "Toner", "Pedido Recomendado"].map(
                    (text) =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text,
                                bold: true,
                                size: 20, // 10 pt
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                }),
                ...tonersConPedido.map(
                  (t) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: t.marca,
                                  size: 20,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: t.toner,
                                  size: 20,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: t.pedido.toString(),
                                  size: 20,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              ],
            }),

            new Paragraph(""),

            new Paragraph(
              "Los toners serán utilizados en las diferentes áreas del municipio"
            ),

            new Paragraph({
              text: "Sin otro particular aprovecho la oportunidad para saludarlo atte",
              alignment: AlignmentType.RIGHT,
            }),

            new Paragraph("Departamento de Informática"),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Pedido_Toners.docx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.send(buffer);
  } catch (error) {
    console.error("ERROR WORD:", error);
    res.status(500).json({ message: "Error generando el Word" });
  }
};

export const getRecommendedOrders = async (req, res) => {
  try {
    const toners = await Toners.find();

    const getRecommendedOrders = toners.map((t) => {
      const pedidoRecomendado = Math.max(t.cantidadIdeal - t.cantidad, 0);

      return {
        _id: t._id,
        marca: t.marca,
        toner: t.toner,
        cantidadActual: t.cantidad,
        cantidadIdeal: t.cantidadIdeal,
        pedidoRecomendado,
      };
    });

    res.json(getRecommendedOrders);
  } catch (error) {
    res.status(500).json({ mesage: "Error al calcular el pedido recomendado" });
  }
};

export const getLowStockToners = async (req, res) => {
  try {
    const toners = await Toners.find();

    const lowStock = toners
      .filter((t) => {
        if (t.cantidadIdeal <= 0) return false;
        const porcentaje = (t.cantidad / t.cantidadIdeal) * 100;
        return porcentaje < 80;
      })
      .map((t) => ({
        _id: t._id,
        marca: t.marca,
        toner: t.toner,
        cantidadActual: t.cantidad,
        cantidadIdeal: t.cantidadIdeal,
        porcentaje: ((t.cantidad / t.cantidadIdeal) * 100).toFixed(2) + "%",
        faltante: Math.max(t.cantidadIdeal - t.cantidad, 0),
      }));

    res.json(lowStock);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los tóners con poco stock", error });
  }
};

import { Router, json } from "express";
import ProductManager from "../datos/ManagerProducts.js";
import { validateProduct } from "../utils/index.js";
import ProductoManager from "../DAO/ProductDAO.js";
const productRouter = Router();

const manager = new ProductManager();
const manager2 = new ProductoManager();

// productos obtenidos de mongo
productRouter.get("/mon", async (req, res) => {
    let productos;
    try{
        productos = await manager2.getAllProducts();
    } catch (error) {
        res.status(404).send({ error: "Internal Server Error", message: "No se han encontrado los productos", details: error })
    }
    res.send({status: "success", payload: productos})
})


productRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let producto;
    try{
        producto = await manager2.getProductById(pid);
        res.send({status: "success", payload: producto})
    } catch (error) {
        res.status(404).send({ error: "Internal Server Error", message: "El producto con ese Id no se encuentra", details: error })
    }
})


productRouter.post("/mon", async (req, res) => {
    let response;
    let { title, description, price, thumbnail, code, stock } = req.body;
    if(!title || !description || !price || !thumbnail || !code || !stock){
        res.status(400).send({ status: "error", message: "producto incompleto" })
    }
    try{
        response = await manager2.addProduct(title, description, price, thumbnail, code, stock);
        res.send({status: "success", payload: response})
    } catch (error){
        res.status(500).send({ error: "Internal Server Error", message: "Error al añadir el producto", details: error })
    }
})

productRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let { title, description, price, thumbnail, code, stock } = req.body;

    if(!title || !description || !price || !thumbnail || !code || !stock){
        return res.status(400).send({ error: "Bad Request", message: "Producto incompleto" });
    } 
    try{
        let productoUpdated = await manager2.updateProduct(pid, { title, description, price, thumbnail, code, stock });
        res.send({ status: "success", payload: productoUpdated });
        } catch (error){
            res.status(500).send({ error: "Internal Server Error", message: "Error al actualizar el producto", details: error });
        }
})

// productos obtenidos de memoria (json)
productRouter.get("/", async (req, res) => {
    let productos = await manager.getProducts()
    const limit = req.query.limit;
    if (limit){
        res.send(productos.slice(0, limit));
    }else{
        res.send(productos);
    }
})

productRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let producto = await manager.getProductById(pid)
    res.send(producto);
})

productRouter.post("/", async (req, res) => {
    let product = req.body;
    if (!validateProduct(product)){
        res.status(400).send({ status: "error", message: "producto incompleto" })
    }
    product.id = await manager.getNextId();
    product.status = true;
    await manager.addProduct(product);
    res.send({ status: "success", message: "producto agregado" })
})

productRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let fields = req.body;
    let updatedProd = await manager.updateProduct(pid, fields);
    if(!updatedProd){
        res.status(404).send({ status: "error", message: "no se pudo actualizar el producto" })
    }
    res.send({ status: "success", message: `Producto ${updatedProd.id} actualizado` }) 
})

productRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let deletedProd = await manager.deleteProduct(pid);
    if(!deletedProd){
        res.status(404).send({ status: "error", message: "producto no encontrado, no se pudo eliminar" })
    }
    res.send({ status: "success", message: `Producto ${deletedProd.id} eliminado` })
})

export default productRouter;



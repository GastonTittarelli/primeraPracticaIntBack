import { Router } from "express";
import CartManager from "../datos/CartManager.js";
import CarritoManager from "../DAO/CartDAO.js";
const cartRouter = Router();


const cartManager = new CartManager();
const cartManager2 = new CarritoManager();

// productos obtenidos de mongo
cartRouter.get("/mon", async (req, res) => {
    let carritos;
    try{
        carritos = await cartManager2.getAllCarts();
    } catch (error) {
        res.status(404).send({ error: "Internal Server Error", message: "No se han encontrado los carritos", details: error })
    }
    res.send({status: "success", payload: carritos})
})



// productos obtenidos de memoria (json)
cartRouter.post("/", async (req, res) => {
let newCart = await cartManager.createCart();
if(!newCart){
    res.status(404).send({status: "error", message: "no se pudo crear el carrito"})
}
res.send({status: "success", message: "carrito creado"})
})

cartRouter.get("/:cid", (req, res) => {
    let cid = req.params.cid;
    let cart = cartManager.getProductOfCart(cid);
    if(!cart){
        res.status(404).send({status: "error", message: "no se pudo encontrar los productos del carrito"})
    }
    res.send(cart);
})

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let cart = await cartManager.addProductToCart(cid, pid);

    if(!cart){	
        res.status(404).send({status: "error", message: "no se pudo agregar el producto al carrito"})
    }
    res.send({status: "success", message: "carrito creado"}) 
})

export default cartRouter;
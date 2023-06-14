import express from "express";
import productRouter from "./src/routes/products.js";
import cartRouter from "./src/routes/cart.js";
import handlebars from "express-handlebars";
import messagesRouter from "./src/routes/messages.js";
import ProductManager from "./src/datos/ManagerProducts.js";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

const manager = new ProductManager();

const app = express();

mongoose.connect('mongodb+srv://g:proyecto321@proyecto.veaq7ux.mongodb.net/ecommerce?retryWrites=true&w=majority');


const serve = http.Server(app);
const io = new Server(serve);

app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars")

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", messagesRouter);


app.get("/hbs", async (req, res) => {
    let productos = await manager.getProducts();

    res.render("productos", {productos});
})


io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    socket.emit("productos", manager.getProducts());
});

app.get('/realtimeproducts', async (req, res) => {
    let productos = await manager.getProducts();
    res.render('realtimeproducts', { productos }); 
});


const PORT = 8080;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en puerto: ${server.address().port}`))
server.on("error", error => console.log(error))
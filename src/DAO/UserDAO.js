import { productsModel } from "./models/products.model.js";

class ProductoManager{
    constructor(){
        this.model = productsModel;
    }

    async getAllProducts(){
        let productos;
        try{
            productos = await this.model.find();
        } catch (error){
        throw error;
        console.log(error);
    }

    return productos;
    }

    async getProductById(id){
        let producto;
        try{
            producto = await this.model.findOne({_id: id});
        } catch (error){
        throw error;
        console.log(error);
    }
    
    return producto;
}

    async addProduct(title, description, price, thumbnail, code, stock){
        let producto;
        try{
            producto = await productsModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            });
        } catch (error){
            console.log(error);
    }
    return producto;
}

    async updateProduct(pid, properties){
        let usuario
        try{
            usuario = await productsModel.updateOne({_id: pid}, properties);
        } catch (error){
            console.log(error);
        }
        return usuario;
    }
}

export default ProductoManager;
import { carritoModel } from "./models/cart.model.js";

class CarritoManager {
    constructor(){
        this.model = carritoModel;
    }

    async getAllCarts(){
        let carritos;
        try{
            carritos = await this.model.find().exec();
            return carritos;
        } catch (error){
        throw error;
    }
}
}

export default CarritoManager;
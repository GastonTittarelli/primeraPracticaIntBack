import { carritoModel } from "./models/cart.model.js";

class CarritoManager {
    constructor(){
        this.model = carritoModel;
    }

    async getAllCarts(){
        let carritos;
        try{
            carritos = await this.model.find();
        } catch (error){
        throw error;
        console.log(error);
    }
    return carritos;
}
}

export default CarritoManager;
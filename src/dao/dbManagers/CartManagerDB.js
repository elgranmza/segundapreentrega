import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

class CartManagerDB {

    async getCarts() {
        try {
            const carts = await cartsModel.find().lean();
            return carts;
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al obtener los carritos"
            };
        }
    }

    async getCartsByID(cid) {
        try {
            const cart = await cartsModel.findOne({ _id: cid }).lean();
            if (!cart) {
                return {
                    status: "error",
                    msg: `El carrito con el id ${cid} no existe`
                };
            }
            return cart;
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: `Error al obtener el carrito con el id ${cid}`
            };
        }
    }

    async createCart() {
        try {
            const cart = await cartsModel.create({});
            return cart;
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al crear el carrito"
            };
        }
    }

    async  addProductInCart(cid, pid, quantity) {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            if (!cart) {
                return {
                    status: "error",
                    msg: `El carrito con el ID ${cid} no existe`
                };
            }
            const product = await productsModel.findOne({ _id: pid });
            if (!product) {
                return {
                    status: "error",
                    msg: `El producto con el ID ${pid} no existe`
                };
            }
            // Buscar el producto en el carrito
            const existingProduct = cart.products.find(e => e.product == pid);
            if (existingProduct) {
                // Si existe, actualizar la cantidad
                existingProduct.quantity += quantity;
            } else {
                // Si no existe, agregarlo al arreglo de productos del carrito
                cart.products.push({ product: pid, quantity });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al agregar el producto al carrito"
            };
        }
    }
    
    async deleteProductInCart(cid, pid) {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            const index = cart.products.findIndex(e => e.product == pid);
            if (index !== -1) {
                const result = cart.products.splice(index, 1);
                await cart.save();
                return {
                    status: "success",
                    msg: result
                };
            } else {
                return {
                    status: "error",
                    msg: `El producto con el id ${pid} no existe en el carrito`
                };
            }
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al eliminar el producto del carrito"
            };
        }
    }

    async deleteAllProductsInCart(cid) {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            cart.products.splice(0, cart.products.length);
            await cart.save();
            return {
                status: "success",
                msg: "Todos los productos han sido eliminados del carrito"
            };
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al eliminar todos los productos del carrito"
            };
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            cart.products.splice(0, cart.products.length);
            cart.products.push(...products.products);
            await cart.save();
            return {
                status: "success",
                msg: cart
            };
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al actualizar el carrito"
            };
        }
    }

    async updateQualityProduct(cid, pid, quantity) {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            const index = cart.products.findIndex(e => e.product == pid);
            if (index !== -1) {
                cart.products[index].quantity = parseInt(quantity);
                await cart.save();
                return {
                    status: "success",
                    msg: cart
                };
            } else {
                return {
                    status: "error",
                    msg: `El producto con el id ${pid} no existe en el carrito`
                };
            }
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: "Error al actualizar la cantidad del producto en el carrito"
            };
        }
    }
}

export default CartManagerDB;

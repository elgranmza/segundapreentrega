import fs from 'fs';
import path from "path";

export default class ProductManager {
    constructor(pathFile) {
        this.path = path.resolve(__dirname, `./files/${pathFile}`);
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(data);
                return carts;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
            return {
                status: "error",
                msg: "Error al obtener los carritos"
            };
        }
    }

    async addCart(products) {
        try {
            const carts = await this.getCarts();
            let cart = { id: 0, products: [] };

            cart.products = [products];
            if (carts.length !== 0) {
                cart.id = carts[carts.length - 1].id + 1;
            }

            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart.id;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return {
                status: "error",
                msg: "Error al crear el carrito"
            };
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(e => e.id == id);
            return cart;
        } catch (error) {
            console.error(`Error al obtener el carrito con el id ${id}:`, error);
            return {
                status: "error",
                msg: `Error al obtener el carrito con el id ${id}`
            };
        }
    }

    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const carts = await this.getCarts();
            const cartIndexToUpdate = carts.findIndex(e => e.id === cid);
            const cartToUpdate = await this.getCartById(cid);
            let cartUpdate;

            if (cartToUpdate) {
                const indexToUpdate = cartToUpdate.products.findIndex(e => e.product == pid);
                if (indexToUpdate !== -1) {
                    const productUpdate = [...cartToUpdate.products];
                    productUpdate.splice(indexToUpdate, 1, {
                        "product": pid,
                        "quantity": cartToUpdate.products[indexToUpdate].quantity + quantity
                    });
                    cartUpdate = {
                        "id": cid,
                        "products": [...productUpdate]
                    };
                } else {
                    cartUpdate = {
                        "id": cid,
                        "products": [
                            ...cartToUpdate.products,
                            {
                                "product": pid,
                                "quantity": quantity
                            }
                        ]
                    };
                }
                carts.splice(cartIndexToUpdate, 1, cartUpdate);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            }

            return cartToUpdate;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            return {
                status: "error",
                msg: "Error al agregar el producto al carrito"
            };
        }
    }
}

import fs from 'fs';
import path from "path";

export default class ProductManager {

    constructor(pathFile){
        this.path = path.resolve(__dirname, `../../files/${pathFile}`);
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return {
                status: "error",
                msg: "Error al obtener los productos"
            };
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            return {
                status: "error",
                msg: "Error al agregar el producto"
            };
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const itemBuscado = products.find(e => e.id == id);
            return itemBuscado;
        } catch (error) {
            console.error(`Error al obtener el producto con el id ${id}:`, error);
            return {
                status: "error",
                msg: `Error al obtener el producto con el id ${id}`
            };
        }
    }

    async updateProduct(id, newData) {
        try {
            const oldData = await this.getProductById(id);
            if (oldData) {
                Object.assign(oldData, newData);
                const allProducts = await this.getProducts();
                const indexToUpdate = allProducts.findIndex(e => e.id === id);
                allProducts.splice(indexToUpdate, 1, oldData);
                await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, '\t'));
            }
            return oldData;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            return {
                status: "error",
                msg: "Error al actualizar el producto"
            };
        }
    }

    async deleteProduct(id) {
        try {
            const allProducts = await this.getProducts();
            const indexToDelete = allProducts.findIndex(e => e.id === id);
            if (indexToDelete !== -1) {
                allProducts.splice(indexToDelete, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, '\t'));
            }
            return indexToDelete !== -1 ? indexToDelete : "Producto no encontrado";
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return {
                status: "error",
                msg: "Error al eliminar el producto"
            };
        }
    }

}

import productsModel from "../models/products.model.js";

class ProductManagerDB {

    getProducts = async (filter, options) => {
        const products = await productsModel.paginate(
            filter,
            options
        );

        return {
            status: "success",
            msg: products
        };
    }

    getProductByID = async (pid) => {
        const product = await productsModel.find({ _id: pid });
        return {
            status: "success",
            msg: product
        };
    }

    createProduct = async (title, category, description, price, code, stock, filename) => {

        if (!title || !category || !description || !price || !code || !stock || !filename) {
            return {
                status: "error",
                message: "valores incompletos"
            }
        }

        const product = {
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnail: `http://localhost:8080/images/${filename}`
        }

        const result = await productsModel.create(product)
        return result

    }

    deleteProduct = async (pid) => {
        const result = await productsModel.deleteOne({ _id: pid });
        return result
    }

    updateProduct = async (pid, title, category, description, price, code, stock) => {

        const updateProduct = {
            title,
            category,
            description,
            price,
            code,
            stock
        }

        const result = await productsModel.updateOne({ _id: pid }, { $set: updateProduct });
        return result
    }



}

export default ProductManagerDB



import React, { createContext, useEffect, useState } from "react";
import cafeAPI from "../api/cafeAPI";
import { 
  IAddProduct, 
  IDeleteProduct, 
  ILoadProductById, 
  IUpdateProduct, 
  IUploadImage, 
  Producto, 
  ProductsResponse 
} from "../interfaces/appInterfaces";

type ProductsContextProps = {
  products:Producto[];
  loadProducts:()=>Promise<void>;
  addProduct:(addProductProps:IAddProduct)=>Promise<void>;
  updateProduct:(updateProductProps:IUpdateProduct)=>Promise<void>;
  deleteProduct:(deleteProductProps:IDeleteProduct)=>Promise<void>;
  loadProductById:(loadProductByIdProps:ILoadProductById)=>Promise<Producto>;
  uploadImage:(uploadImageProps:IUploadImage)=>Promise<void>;
}

export const ProductsContext = createContext({} as ProductsContextProps)

export const ProductsProvider = ({children}:any) => {

  const [ products, setProducts ] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, [])
  

  const loadProducts = async() => {
    const resp = await cafeAPI.get<ProductsResponse>('/productos?limite=50');
    setProducts([...products, ...resp.data.productos])
  }

  const addProduct = async(addProductProps:IAddProduct) => {}

  const updateProduct = async(updateProductProps:IUpdateProduct) => {}

  const deleteProduct = async(deleteProductProps:IDeleteProduct) => {}

  const loadProductById = async(loadProductByIdProps:ILoadProductById) => {
    throw new Error('Not implemented')
  }

  const uploadImage = async(uploadImageProps:IUploadImage) => {}

  return(
    <ProductsContext.Provider value={{
      products,
      loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      loadProductById,
      uploadImage
    }}>
      { children }
    </ProductsContext.Provider>
  )
}
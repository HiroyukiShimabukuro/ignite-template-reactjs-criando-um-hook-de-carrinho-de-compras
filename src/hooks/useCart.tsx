import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}
 
interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });  
  
  const addProduct = async (productId: number) => {
    try {
      const product = api.get('/products/'+productId).then((response) => response.data);
      console.log(product);
      const cartItems = [...cart];
      const alreadyAdded = cartItems.find((product)=> product.id === productId);
      // console.log(alreadyAdded);
      
      if(alreadyAdded){
        console.log('teste');

      }else{
        // setCart(product[productId]);
        const product = api.get('/products/'+productId).then((response) => setCart([{...response.data, amount: 1}]));

        console.log('set');
        console.log(cart);
        console.log(product);
        
        // localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
      }

      console.log('product');
      
      // setCart(productId);
      // const stock = api.get('/stock').then((response) => response.data)
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

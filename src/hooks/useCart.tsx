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
      const cartItems = [...cart];
      const { data } = await api.get('/products/'+productId);
      const alreadyAdded = cartItems.find((product)=> product.id === productId);
      
      if(alreadyAdded){
        const stock : {data: Stock} = await api.get('/stock/'+productId)
        
        const addedProduct = cart.map((el) => {
          if(stock.data.amount > el.amount){
            if(alreadyAdded.id == el.id) el.amount = el.amount +1;
            return el;
          }
          else {
            toast.error('Quantidade solicitada fora de estoque');
            return el;
          }
        }) 
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(addedProduct))
      }else{
        cartItems.push({...data, amount: 1});
        setCart(cartItems);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartItems))
      }
    } catch {
      toast.error('Erro na adição do produto');
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

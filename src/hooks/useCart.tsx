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
        
        if(stock.data.amount <= alreadyAdded.amount) return toast.error('Quantidade solicitada fora de estoque');
        else {
          alreadyAdded.amount = alreadyAdded.amount + 1;
          setCart(cartItems);
        }
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartItems))
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
      if(!cart.find((product) => product.id === productId)) throw new Error('ProductNotFound');
      const afterRemove = cart.filter((product)=> product.id !== productId);
      setCart(afterRemove);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(afterRemove))

    } catch {
      toast.error('Erro na remoção do produto');
    }
  };
  
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount === 0) return; 
      const {data: Stock} = await api.get('/stock/'+productId);
      if(amount > Stock.amount) return toast.error('Quantidade solicitada fora de estoque');
      const update = cart.map((el)=>{
        if(el.id === productId && amount <= Stock.amount){
          el.amount = amount;
        }
        return el;
      })
      setCart(update);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(update))
      
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
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

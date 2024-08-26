
import { CartProvider } from '@/context/CartContext'; 

const Provider = ({children}) => {
  return (
   <CartProvider>
    {children}
   </CartProvider>
  )
}

export default Provider


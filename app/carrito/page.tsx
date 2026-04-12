import CartClient from '@/components/CartClient';

export default function CartPage() {
  const whatsappNumber = process.env.NUMBER_WASAP || '';
  return <CartClient whatsappNumber={whatsappNumber} />;
}
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Trash2 } from "lucide-react";

const CartSheet = ({ children }: { children: ReactNode }) => {
  const { items, total, updateQty, removeItem } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.productId} className="flex gap-3">
                  <img src={i.image} alt={i.name} className="h-16 w-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{i.name}</p>
                    <p className="text-sm text-primary font-bold">${i.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(i.productId, i.quantity - 1)} className="h-6 w-6 rounded border border-border text-sm">-</button>
                      <span className="text-sm w-6 text-center">{i.quantity}</span>
                      <button onClick={() => updateQty(i.productId, i.quantity + 1)} className="h-6 w-6 rounded border border-border text-sm">+</button>
                      <button onClick={() => removeItem(i.productId)} className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-3 sm:flex-col">
            <div className="flex justify-between font-extrabold text-lg w-full">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <SheetClose asChild>
              <Button asChild variant="hero" className="w-full">
                <Link to="/checkout">Checkout</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
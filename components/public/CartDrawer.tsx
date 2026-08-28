"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/context/StoreContext";
import { X, Plus, Minus } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart,
  } = useStore();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let msg = `*New Order Inquiry from RC GADGETS*\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.title}\n   Qty: ${item.quantity} | Price: ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}\n`;
    });
    msg += `\n*Total: ₹${cartTotal.toLocaleString("en-IN")}*\n\n`;
    msg += `Please confirm availability and dispatch details.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/917510110155?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 tracking-tight">
                Bag
              </h2>
              <p className="text-[11px] text-neutral-400 font-normal mt-0.5">
                {cartCount} item{cartCount !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Close bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                    Discover high-performance RC models and precision accessories.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-colors inline-block"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="py-4 flex items-start gap-4"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-white border border-neutral-100 p-2 shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-300">RC Model</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 mb-0.5">
                        {product.brand_name || product.category_name}
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-snug tracking-tight">
                        {product.title}
                      </h4>
                      <div className="mt-1 text-xs font-semibold text-neutral-900">
                        ₹{(product.price * quantity).toLocaleString("en-IN")}
                      </div>

                      {/* Controls */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-neutral-200 bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium text-neutral-800 select-none">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[11px] text-neutral-400 hover:text-red-600 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-white space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-lg font-bold text-neutral-900 tracking-tight">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                Free Pan-India Delivery on all RC models
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Checkout via WhatsApp
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer text-center"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

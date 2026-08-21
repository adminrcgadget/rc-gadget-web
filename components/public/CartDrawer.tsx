"use client";

import React from "react";
import Image from "next/image";
import { useStore } from "@/components/context/StoreContext";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

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

    let msg = `*🚀 New Order Inquiry from RC GADGETS Website*\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.title}*\n   Qty: ${item.quantity} | Price: ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}\n`;
    });
    msg += `\n*💰 Total Estimated Value: ₹${cartTotal.toLocaleString("en-IN")}*\n\n`;
    msg += `Please confirm product availability, shipping options, and payment details!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/917510110155?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-[#111111]">
                  Your Shopping Cart
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#111111]">
                    Your Cart Is Empty
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Browse our RC models, parts & accessories to get started.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#FF5A00] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF6A00]"
                >
                  Explore Models
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-xl bg-white border border-gray-200/80 shrink-0 overflow-hidden flex items-center justify-center p-1">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#FF5A00]">
                        {product.category_name}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">
                        {product.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-black text-[#111111]">
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-rose-500"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800 select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
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
            <div className="p-6 border-t border-gray-100 bg-white space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-500">Subtotal:</span>
                <span className="text-lg font-black text-[#111111]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Pan-India Safe Shockproof Delivery Guaranteed</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 rounded-xl bg-[#FF5A00] hover:bg-[#FF6A00] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order via WhatsApp Direct</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase text-center"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

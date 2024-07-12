"use client";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { createExternalStore } from "../sync/create-external-store";
import { Flow } from "~/src/hooks/observer-flow";
import { Observable } from "~/src/hooks/observer";

type BaseState = { id: string | number };
type CheckoutStateType<T extends BaseState> = {
  products: T[];
  productsCount: number;
};

class Checkout<T extends BaseState> extends Observable<CheckoutStateType<T>> {
  state: CheckoutStateType<T>;
  constructor() {
    super();
    this.state = {
      products: [],
      productsCount: 0,
    } satisfies CheckoutStateType<T>;
  }
  dispatch(s: Partial<CheckoutStateType<T>>) {
    this.state = { ...this.state, ...s };
    this.state.productsCount = this.state.products.length;

    this.notifyObservers(this.getSnapshot());
  }

  addToCard(s: CheckoutStateType<T>["products"][number]) {
    this.dispatch({ products: [...this.state.products, s] });
  }

  removeCart = (s: CheckoutStateType<T>["products"][number]["id"]) => {
    this.dispatch({ products: this.state.products.filter((item) => item.id !== s) });
  };

  getSnapshot() {
    return this.state;
  }
}

const checkout = new Checkout();

export default function Page() {
  const [_, setState] = useState(() => checkout.getSnapshot());
  useEffect(() => {
    checkout.addObserver(setState);
    return () => {
      checkout.removeObserver(setState);
    };
  }, []);

  return (
    <div>
      <div className="">
        {checkout.state.products.map((item) => (
          <div className="" key={item.id}>
            {item.id}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          checkout.addToCard({ id: Math.random().toString().slice(0, 3) });
        }}
      >
        add cart
      </button>
    </div>
  );
}

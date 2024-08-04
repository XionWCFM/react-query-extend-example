interface Specification<T> {
  isSatisfied(item: T): boolean;
}

class MegaFilter<T> {
  filter(products: T[], spec: Specification<T>): T[] {
    return products.filter((product) => spec.isSatisfied(product));
  }
}

class OrSpecification<T> implements Specification<T> {
  private specs: Specification<T>[];

  constructor(...specs: Specification<T>[]) {
    this.specs = specs;
  }

  isSatisfied(item: T): boolean {
    return this.specs.some((spec) => spec.isSatisfied(item));
  }
}
class AndSpecification<T> implements Specification<T> {
  private specs: Specification<T>[];

  constructor(...specs: Specification<T>[]) {
    this.specs = specs;
  }

  isSatisfied(item: T): boolean {
    return this.specs.every((spec) => spec.isSatisfied(item));
  }
}

type HamType = {
  type: "HAM" | "RAL" | "KIM";
  price: number;
};

class HamSpecification implements Specification<HamType> {
  isSatisfied(item: HamType): boolean {
    return item.type === "HAM";
  }
}

class PriceSpecification implements Specification<HamType> {
  private price: number;

  constructor(price: number) {
    this.price = price;
  }

  isSatisfied(item: HamType): boolean {
    return item.price === this.price;
  }
}

const exmapleHamList: HamType[] = [
  { type: "HAM", price: 100 },
  { type: "HAM", price: 50 },
  { type: "RAL", price: 200 },
  { type: "KIM", price: 300 },
];

const megaFilter = new MegaFilter<HamType>();
const hamSpec = new AndSpecification(new HamSpecification(), new PriceSpecification(100));

const result = megaFilter.filter(exmapleHamList, hamSpec);

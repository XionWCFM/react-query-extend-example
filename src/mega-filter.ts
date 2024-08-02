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

export class Product {
  id: number;
  name: string;
  price: number;
  createdAt: Date;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.createdAt = new Date();
  }
}

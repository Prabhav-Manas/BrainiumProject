export interface Product {
  _id: string;
  category: string;
  productName: string;
  description: string;
  price: number;
  startDate: string | Date;
  closeDate: string | Date;
  discount: number;
  imagePath: string;
  mainImage?: string | null;
  quantity?: number;
}

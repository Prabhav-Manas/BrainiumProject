export interface Product {
  _id: string;
  category: string;
  productName: string;
  description: string;
  price: number;
  startDate: string | Date;
  closeDate: string | Date;
  discount: number;
  images: string[];
  mainImage?: string | null;
  quantity?: number;
}

export interface CategoryApiResponse {
  message: string;
  category: {
    _id: string;
    name: string;
  };
  categoryId: string;
}

export interface IResponse {
  data: any;
  status: boolean;
  validationErrors?: any;
}

export interface IPaginatedResponse extends IResponse {
  pagination: {
    total: number;
    currentPage: number;
  }
}
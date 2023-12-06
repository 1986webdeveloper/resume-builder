export interface GenerateToken {
  userId: string | Object;
  email: string;
}

export interface CustomError {
  error: string;
  statusCode: number;
  valid: boolean;
}

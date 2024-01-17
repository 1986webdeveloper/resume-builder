export interface SendEmail {
  email: string;
  filePath?: string;
  subject: string;
  content?: string;
  html?: string
}

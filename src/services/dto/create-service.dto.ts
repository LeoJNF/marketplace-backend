// DTO Limpo: Sem validações para evitar erro 400 no upload de arquivo
export class CreateServiceDto {
  title: string;
  description: string;
  price: number | string; // Aceita os dois tipos
  category: string;
  location: string;
  coverUrl?: string;
  videoUrl?: string;
}

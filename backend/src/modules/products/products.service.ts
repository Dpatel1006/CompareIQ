import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

interface SerperProduct {
  title: string;
  source: string;
  link: string;
  price?: string;
  rating?: number;
  ratingCount?: number;
  imageUrl?: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async search(query: string, category?: string) {
    // First check local database
    const localProducts = await this.prisma.product.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        ...(category && { category: { equals: category, mode: 'insensitive' } }),
      },
      take: 10,
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        price: true,
        imageUrl: true,
      },
    });

    if (localProducts.length >= 5) {
      return localProducts;
    }

    // Fallback: search via Serper API
    try {
      const serperResults = await this.searchSerper(query, category);
      const combined = [...localProducts];

      for (const result of serperResults) {
        const exists = combined.some(
          (p) => p.name.toLowerCase() === result.title.toLowerCase(),
        );
        if (!exists) {
          // Upsert into database
          const product = await this.prisma.product.upsert({
            where: { id: `serper_${Buffer.from(result.title).toString('base64').slice(0, 20)}` },
            update: {
              price: result.price ? parseFloat(result.price.replace(/[^0-9.]/g, '')) : null,
              imageUrl: result.imageUrl || null,
              rating: result.rating || null,
              reviewCount: result.ratingCount || null,
            },
            create: {
              name: result.title,
              brand: this.extractBrand(result.title),
              category: category || 'General',
              price: result.price ? parseFloat(result.price.replace(/[^0-9.]/g, '')) : null,
              imageUrl: result.imageUrl || null,
              specs: {},
              rating: result.rating || null,
              reviewCount: result.ratingCount || null,
              sourceUrl: result.link,
            },
            select: {
              id: true,
              name: true,
              brand: true,
              category: true,
              price: true,
              imageUrl: true,
            },
          });
          combined.push(product);
        }
      }

      return combined.slice(0, 10);
    } catch (error) {
      this.logger.warn('Serper API search failed, returning local results only', error);
      return localProducts;
    }
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findOrCreateByName(name: string): Promise<string> {
    let product = await this.prisma.product.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (!product) {
      product = await this.prisma.product.create({
        data: {
          name,
          brand: this.extractBrand(name),
          category: 'General',
          specs: {},
        },
      });
    }

    return product.id;
  }

  private async searchSerper(query: string, category?: string): Promise<SerperProduct[]> {
    const apiKey = this.configService.get<string>('SERPER_API_KEY');
    if (!apiKey || apiKey === 'your-serper-api-key') {
      return [];
    }

    const searchQuery = category ? `${query} ${category}` : query;

    const response = await fetch('https://google.serper.dev/shopping', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: searchQuery, num: 10 }),
    });

    if (!response.ok) {
      throw new Error(`Serper API returned ${response.status}`);
    }

    const data = await response.json();
    return (data.shopping || []).map((item: any) => ({
      title: item.title,
      source: item.source,
      link: item.link,
      price: item.price,
      rating: item.rating,
      ratingCount: item.ratingCount,
      imageUrl: item.imageUrl,
    }));
  }

  private extractBrand(productName: string): string | null {
    const knownBrands = [
      'Apple', 'Samsung', 'Google', 'Sony', 'Microsoft', 'Dell', 'HP',
      'Lenovo', 'Asus', 'Acer', 'LG', 'Xiaomi', 'OnePlus', 'Nike',
      'Adidas', 'Canon', 'Nikon', 'Bose', 'JBL', 'Dyson',
    ];

    for (const brand of knownBrands) {
      if (productName.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }

    return null;
  }
}

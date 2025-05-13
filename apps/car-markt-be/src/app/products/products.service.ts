/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../../generated/prisma/client';

type FindConfig = { featured?: boolean };

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProductInput: CreateProductInput) {
    return 'This action adds a new product';
  }

  findAll(config: FindConfig) {
    return this.prisma.product.findMany({
      where: config.featured !== undefined ? { isFeatured: true } : undefined,
    });
  }

  findOne(id: string) {
    return this.prisma.product.findFirst({
      where: {
        id,
      },
    });
  }

  async searchProducts(term: string): Promise<Product[]> {
    const lowercaseTerm = term.toLowerCase();
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: lowercaseTerm, mode: 'insensitive' } },
          { description: { contains: lowercaseTerm, mode: 'insensitive' } },
        ],
      },
    });
  }

  update(id: number, updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

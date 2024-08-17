import { Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(data: Prisma.ArticleCreateInput): Promise<Article> {
    try {
      return await this.prisma.article.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('The periodIndex must be unique.');
        }
      }
      throw error;
    }
  }

  async findArticleById(id: number): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async findAllArticles(): Promise<Article[]> {
    return this.prisma.article.findMany();
  }

  async updateArticle(
    id: number,
    data: Prisma.ArticleUpdateInput,
  ): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async deleteArticle(id: number): Promise<Article> {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}

import { PrismaClient } from "@prisma/client";
import { Product } from "../../../entities/product";
import { ProductRepository } from "../product.repository";

export class ProductRepositoryPrisma implements ProductRepository {
    private constructor(readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new ProductRepositoryPrisma(prisma);
    }

    public async save(product: Product): Promise<void> {
        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
        };

        await this.prisma.product.create({
            data,
        });
    }
    public async list(): Promise<Product[]> {
        const aProducts = await this.prisma.product.findMany();

        const products: Product[] = aProducts.map((p) => {
            const { id, name, price, quantity } = p;
            return Product.with(id, name, price, quantity);
        });

        return products;
    }
    public async update(product: Product): Promise<void> {
        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
        };

        await this.prisma.product.update({
            where: {
                id: product.id,
            },
            data,
        });
    }
    public async find(id: string): Promise<Product | null> {
        const aProduct = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!aProduct) {
            return null;
        }

        const { name, price, quantity } = aProduct;

        const product = Product.with(id, name, price, quantity);

        return product;
    }
}

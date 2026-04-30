import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptsModule } from './receipts/receipts.module';
import { Receipt } from './receipts/entities/receipt.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { GraphqlModule } from './graphql/graphql.module';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'pg-db',
      entities: [Receipt, Category, Product],
      synchronize: true, // set to false in production
    }),
  
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // ✅ We will switch between schema-first and code-first later
      // typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')], // schema-first
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), // code-first (later)

      playground: true,
    }),

    ReceiptsModule,
    NotificationsModule,
    OrdersModule,
    CoreModule,
    CategoryModule,
    ProductModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

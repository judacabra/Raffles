import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { getDatabaseConfig } from './config/database.config';

import { TenantMiddleware } from './common/tenant/tenant.middleware';

import { CompanyModule } from './app/modules/admin/company/company.module';
import { RoleModule } from './app/modules/admin/role/role.module';
import { UserModule } from './app/modules/admin/user/user.module';
import { RaffleModule } from './app/modules/public/raffle/raffle.module';
import { SaleModule } from './app/modules/public/sale/sale.module';
import { AuthModule } from './app/modules/admin/auth/auth.module';
import { NotificationModule } from './app/modules/admin/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    CompanyModule,
    RoleModule,
    UserModule,
    RaffleModule,
    SaleModule,
    NotificationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}

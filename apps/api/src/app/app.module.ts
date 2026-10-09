import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { DataDragonModule } from './data-dragon/data-dragon.module';
import { GuideReportModule } from './guide-report/guide-report.module';
import { GuidesModule } from './guides/guides.module';
import { I18N } from './i18n.config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RiotApiModule } from './riot-api/riot-api.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    I18nModule.forRoot(I18N.config),
    AuthModule,
    UsersModule,
    RiotApiModule,
    GuidesModule,
    GuideReportModule,
    DataDragonModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { I18nModule } from 'nestjs-i18n'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CommentsModule } from './comments/comments.module'
import { DataDragonModule } from './data-dragon/data-dragon.module'
import { GuidesModule } from './guides/guides.module'
import { I18N } from './i18n.config'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { ReportModule } from './report/report.module'
import { RiotApiModule } from './riot-api/riot-api.module'
import { UsersModule } from './users/users.module'
import { join } from 'path'

const isProduction = process.env.NODE_ENV === 'production'
const apiPrefix = process.env.API_PREFIX ?? 'api'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ...(isProduction
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'admin'),
            exclude: [`/${apiPrefix}`, `/${apiPrefix}/{*splat}`],
          }),
        ]
      : []),
    I18nModule.forRoot(I18N.config),
    AuthModule,
    UsersModule,
    RiotApiModule,
    GuidesModule,
    ReportModule,
    DataDragonModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

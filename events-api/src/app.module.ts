import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => {
        const url = c.get<string>('DATABASE_URL');
        const base = { type: 'postgres' as const, autoLoadEntities: true, synchronize: true };
        return url
          ? { ...base, url }
          : {
              ...base,
              host: c.get<string>('DB_HOST'),
              port: +(c.get<string>('DB_PORT') || 5432),
              username: c.get<string>('DB_USER'),
              password: c.get<string>('DB_PASSWORD'),
              database: c.get<string>('DB_NAME'),
            };
      },
    }),
    AuthModule,
    UsersModule,
    EventsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import swaggerConfig from './config/swagger.config';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/users/entities/role.entity';
import { UserIdentityVerification } from './modules/users/entities/user-identity-verification.entity';
import { Venue } from './modules/venues/entities/venue.entity';
import { VenueBusinessVerification } from './modules/venues/entities/venue-business-verification.entity';
import { Amenity } from './modules/venues/entities/amenity.entity';
import { Space } from './modules/spaces/entities/space.entity';
import { SpacePrice } from './modules/spaces/entities/space-price.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { Conversation } from './modules/conversations/entities/conversation.entity';
import { Message } from './modules/conversations/entities/message.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { OtpVerification } from './modules/auth/entities/otp-verification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
      load: [appConfig, jwtConfig, swaggerConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        // autoLoadEntities: true,
        entities: [
          User,
          Role,
          UserIdentityVerification,
          Venue,
          VenueBusinessVerification,
          Amenity,
          Space,
          SpacePrice,
          Booking,
          Payment,
          Notification,
          Conversation,
          Message,
          RefreshToken,
          OtpVerification,
        ],
        synchronize: false,
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
        new QueryResolver(['lang']),
      ],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('greet')
  greet(@I18n() i18n: I18nContext) {
    return {
      message: i18n.t('common.greeting'),
      lang: i18n.lang,
    };
  }
}

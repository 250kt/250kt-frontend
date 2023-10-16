import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = '250kt-cs';

  constructor(
      public translate: TranslateService,
  ) {
      translate.addLangs(['en', 'fr']);
      translate.setDefaultLang('en');
      const browserLang: any = translate.getBrowserLang();
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}

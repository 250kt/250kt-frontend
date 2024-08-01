import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {NgOptimizedImage} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TranslateModule} from "@ngx-translate/core";
import {MatCardAvatar} from "@angular/material/card";
import {MatBadge} from "@angular/material/badge";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        NgOptimizedImage,
        MatSlideToggleModule,
        TranslateModule,
        MatCardAvatar,
        MatBadge
    ],
  providers: [],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
  ]
})
export class CoreModule {
}

import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {SideNavComponent} from "./components/sidenav/sidenav.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    NgOptimizedImage
  ],
  providers: [],
  exports: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
  ]
})
export class CoreModule {
}

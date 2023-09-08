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
import {
  MapObjectSelectionPanelComponent
} from "./components/map-object-selection-panel/map-object-selection-panel.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    MapObjectSelectionPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    NgOptimizedImage,
    MatSlideToggleModule
  ],
  providers: [],
  exports: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    MapObjectSelectionPanelComponent,
  ]
})
export class CoreModule {
}

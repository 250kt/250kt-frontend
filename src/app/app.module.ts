import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import {MaterialModule} from "./shared/material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ApplicationAuthLoginComponent} from "./application-auth/application-auth-login/application-auth-login.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ApplicationAdminComponent } from './application-admin/application-admin.component';
import { ApplicationAuthRegisterComponent } from './application-auth/application-auth-register/application-auth-register.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { ApplicationAuthComponent } from './application-auth/application-auth.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelect} from "@angular/material/select";
import {
    UserAircraftsComponent
} from "./aircraft/user-aircrafts/user-aircrafts.component";
import {MatActionList, MatList, MatListItem, MatNavList} from "@angular/material/list";
import {MatLine, MatOption, MatRipple} from "@angular/material/core";
import {TokenInterceptorService} from "./service/token-interceptor.service";
import {NgOptimizedImage, registerLocaleData} from "@angular/common";
import {MatBadge} from "@angular/material/badge";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {MatPaginator} from "@angular/material/paginator";
import {MapElementSelectionPanelComponent} from "./map/map-element-selection-panel/map-element-selection-panel.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {PrepareFlightComponent} from "./map/prepare-flight.component";
import {MapAirfieldInfoComponent} from "./map/map-airfield-info-component/map-airfield-info.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {DurationToHoursMinutesPipe} from "./duration-to-hours-minutes.pipe";
import localeFr from '@angular/common/locales/fr';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
registerLocaleData(localeFr);
@NgModule({ declarations: [
        AppComponent,
        ApplicationAuthLoginComponent,
        ApplicationHomeComponent,
        UserProfileComponent,
        ApplicationAdminComponent,
        ApplicationAuthRegisterComponent,
        ApplicationAuthComponent,
        UserAircraftsComponent,
        ConfirmEmailComponent,
        MapElementSelectionPanelComponent,
        PrepareFlightComponent,
        MapAirfieldInfoComponent,
    ],
    exports: [
        MapElementSelectionPanelComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        MaterialModule,
        CoreModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MatTabsModule,
        MatOption,
        MatSelect,
        MatActionList,
        MatListItem,
        MatList,
        MatLine,
        MatAutocompleteTrigger,
        MatAutocomplete,
        NgOptimizedImage,
        MatBadge,
        MatProgressSpinner,
        MatTooltip,
        MatDivider,
        MatPaginator,
        MatSlideToggle,
        MatNavList,
        FormsModule,
        MatCheckbox,
        DurationToHoursMinutesPipe,
        MatRipple,
        CdkDropList,
        CdkDrag,
        MatAutocompleteTrigger], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: 'fr-FR'
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}



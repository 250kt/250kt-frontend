import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {MaterialModule} from "./shared/material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ApplicationAuthLoginComponent} from "./application-auth/application-auth-login/application-auth-login.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ApplicationAdminComponent } from './application-admin/application-admin.component';
import { ApplicationAuthRegisterComponent } from './application-auth/application-auth-register/application-auth-register.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { ApplicationAuthComponent } from './application-auth/application-auth.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {
    UserAircraftsComponent
} from "./aircraft/user-aircrafts/user-aircrafts.component";
import {MatActionList, MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {TokenInterceptorService} from "./service/token-interceptor.service";
import {NgOptimizedImage} from "@angular/common";
import {MatBadge} from "@angular/material/badge";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {MatPaginator} from "@angular/material/paginator";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        ApplicationAuthLoginComponent,
        ApplicationHomeComponent,
        UserProfileComponent,
        ApplicationAdminComponent,
        ApplicationAuthRegisterComponent,
        ApplicationAuthComponent,
        UserAircraftsComponent,
        ConfirmEmailComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        CoreModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        MatButtonModule,
        HttpClientModule,
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
        MatPaginator
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}



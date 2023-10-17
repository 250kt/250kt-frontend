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
import {ApplicationLoginComponent} from "./application-authent/application-login/application-login.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import { ApplicationProfileComponent } from './application-profile/application-profile.component';
import { ApplicationAdminComponent } from './application-admin/application-admin.component';
import { ApplicationRegisterComponent } from './application-authent/application-register/application-register.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { ApplicationAuthentComponent } from './application-authent/application-authent.component';
import {MatTabsModule} from "@angular/material/tabs";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        ApplicationLoginComponent,
        ApplicationHomeComponent,
        ApplicationProfileComponent,
        ApplicationAdminComponent,
        ApplicationRegisterComponent,
        ApplicationAuthentComponent
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
        MatTabsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}



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
import {ApplicationLoginComponent} from "./application-login/application-login.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {NgOptimizedImage} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import { ApplicationProfileComponent } from './application-profile/application-profile.component';
import { ApplicationAdminComponent } from './application-admin/application-admin.component';
import { ApplicationRegisterComponent } from './application-register/application-register.component';

@NgModule({
    declarations: [
        AppComponent,
        ApplicationLoginComponent,
        ApplicationHomeComponent,
        ApplicationProfileComponent,
        ApplicationAdminComponent,
        ApplicationRegisterComponent
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
        MatSnackBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}


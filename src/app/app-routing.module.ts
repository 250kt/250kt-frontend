import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicationLoginComponent} from "./application-authent/application-login/application-login.component";
import {AuthenticatedGuard} from "./service/authenticated.guard";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import {ApplicationProfileComponent} from "./application-profile/application-profile.component";
import {NotAuthenticatedGuard} from "./service/not-authenticated.guard";
import {ApplicationAdminComponent} from "./application-admin/application-admin.component";
import {AuthenticatedAdminGuard} from "./service/authenticated-admin.guard";
import {ApplicationRegisterComponent} from "./application-authent/application-register/application-register.component";
import {ApplicationAuthentComponent} from "./application-authent/application-authent.component";

const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: ApplicationHomeComponent,
    },
    {
        path: 'login',
        component: ApplicationAuthentComponent,
        canActivate: [NotAuthenticatedGuard],
    },
    {
        path: 'profile',
        component: ApplicationProfileComponent,
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'admin',
        component: ApplicationAdminComponent,
        canActivate: [AuthenticatedAdminGuard],
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


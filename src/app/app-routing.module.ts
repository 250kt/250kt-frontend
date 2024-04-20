import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicationAuthLoginComponent} from "./application-auth/application-auth-login/application-auth-login.component";
import {AuthenticatedGuard} from "./guard/authenticated.guard";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import {ApplicationProfileComponent} from "./application-profile/application-profile.component";
import {NotAuthenticatedGuard} from "./guard/not-authenticated.guard";
import {ApplicationAdminComponent} from "./application-admin/application-admin.component";
import {AuthenticatedAdminGuard} from "./guard/authenticated-admin.guard";
import {ApplicationAuthRegisterComponent} from "./application-auth/application-auth-register/application-auth-register.component";
import {ApplicationAuthComponent} from "./application-auth/application-auth.component";
import {ApplicationAircraftComponent} from "./application-aircraft/application-aircraft.component";

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
        path: 'signin',
        component: ApplicationAuthComponent,
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
    },
    {
        path: 'aircraft-create',
        component: ApplicationAircraftComponent,
        canActivate: [AuthenticatedGuard],
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


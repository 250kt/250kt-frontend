import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from "./guard/authenticated.guard";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {NotAuthenticatedGuard} from "./guard/not-authenticated.guard";
import {ApplicationAdminComponent} from "./application-admin/application-admin.component";
import {AuthenticatedAdminGuard} from "./guard/authenticated-admin.guard";
import {ApplicationAuthComponent} from "./application-auth/application-auth.component";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {PrepareFlightComponent} from "./map/prepare-flight.component";

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
        component: UserProfileComponent,
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'admin',
        component: ApplicationAdminComponent,
        canActivate: [AuthenticatedAdminGuard],
    },
    {
        path: 'prepare-flight',
        component: PrepareFlightComponent,
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'confirm-email',
        component: ConfirmEmailComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


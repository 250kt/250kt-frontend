import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from "./guard/authenticated.guard";
import {ApplicationHomeComponent} from "./application-home/application-home.component";
import {ApplicationProfileComponent} from "./application-profile/application-profile.component";
import {NotAuthenticatedGuard} from "./guard/not-authenticated.guard";
import {ApplicationAdminComponent} from "./application-admin/application-admin.component";
import {AuthenticatedAdminGuard} from "./guard/authenticated-admin.guard";
import {ApplicationAuthComponent} from "./application-auth/application-auth.component";
import {CreateAircraftComponent} from "./aircraft/create-aircraft/create-aircraft.component";
import {
    UserAircraftsComponent
} from "./aircraft/user-aircrafts/user-aircrafts.component";
import {ApplicationMapComponent} from "./application-map/application-map.component";

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
        path: 'map',
        component: ApplicationMapComponent,
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'aircraft',
        children: [
            {
                path: 'create',
                component: CreateAircraftComponent,
                canActivate: [AuthenticatedGuard],
            },
            {
                path: 'list',
                component: UserAircraftsComponent,
                canActivate: [AuthenticatedGuard],
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


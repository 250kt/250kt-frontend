import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";

@Component({
    selector: 'app-application-admin',
    templateUrl: './application-admin.component.html',
})
export class ApplicationAdminComponent implements OnInit {

    constructor(
       private readonly authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.authService.isAdmin();
    }


}

import {Component} from "@angular/core";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html'
})
export class SideNavComponent {

    constructor(
        public authService: AuthService
    ) {}

    logout() {
        this.authService.logout();
    }

}

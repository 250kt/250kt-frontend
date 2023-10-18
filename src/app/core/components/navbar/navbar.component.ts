import {Component} from "@angular/core";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html'
})
export class NavbarComponent {

    constructor(
        public authService: AuthService
    ) {}

    logout() {
        this.authService.logout();
    }

}

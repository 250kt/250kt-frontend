import {Component} from "@angular/core";

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html'
})
export class SideNavComponent {

  isOpen : boolean = false;

  toggleMenu(){
    this.isOpen = !this.isOpen;
  }

}

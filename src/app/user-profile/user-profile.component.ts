import {Component, OnInit} from '@angular/core';
import { UserService } from '../service/user.service';
import {User} from "../shared/model/user";

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit{

    user?: User;

    constructor(
        private readonly userService: UserService,
    ) {}

    ngOnInit() {
        this.getUserProfile();
    }


    getUserProfile() {
        this.userService.getUserProfile().subscribe((user: User) => {
            this.user = user;
        });
    }

}

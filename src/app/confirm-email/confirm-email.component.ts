import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../service/user.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit{
    constructor(
        private readonly route: ActivatedRoute,
        private readonly userService: UserService,
    ) {}

    emailConfirmed: boolean = false;
    loading: boolean = true;

    ngOnInit(): void {
        this.route.queryParams.pipe(delay(500)).subscribe(params => {
            const paramValue = params['code'];
            this.userService.confirmEmail(paramValue).subscribe(
                {
                    next: () => {
                        this.emailConfirmed = true;
                        this.loading = false;
                    },
                    error: () => {
                        this.emailConfirmed = false;
                        this.loading = false;
                    }
                }
            )
        });
    }
}

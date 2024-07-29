import {Component, OnInit} from '@angular/core';
import { UserService } from '../service/user.service';
import {User} from "../shared/model/user";
import {Airfield} from "../shared/model/airfield";
import {map, Observable, startWith} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AirfieldService} from "../service/airfield.service";
import {AirfieldUtils} from "../shared/utils/airfield.utils";
import {SnackbarService} from "../service/snackbar.service";
import {SnackbarTiming} from "../shared/model/snackbarTiming";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit{

    constructor(
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService,
        protected readonly airfieldUtils: AirfieldUtils,
        private readonly snackbarService: SnackbarService,
        private readonly translateService: TranslateService,
    ) {}

    user?: User;
    airfields!: Airfield[];
    filteredAirfields!: Observable<Airfield[]>;

    form: FormGroup = new FormGroup({
        favoriteAirfield: new FormControl('', [Validators.required]),
    });
    changeFavoriteAirfield: boolean = false;


    ngOnInit() {
        this.getUserProfile();
    }


    getUserProfile() {
        this.userService.getUserProfile().subscribe((user: User) => {
            this.user = user;
        });
    }

    updateFavoriteAirfield() {
        console.log(this.form.controls['favoriteAirfield'].value)
        if (this.form.valid) {
           this.userService.updateFavoriteAirfield(this.form.controls['favoriteAirfield'].value).subscribe(
               {
                     next: (res) => {
                         this.getUserProfile();
                         this.snackbarService.openSnackBar(this.translateService.instant('profile.update-favorite-airfield-success'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);

                     },
                    error: (error) => {
                        console.log(error);
                        this.snackbarService.openSnackBar(this.translateService.instant('profile.update-favorite-airfield-error'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);

                    }
               });
           this.changeFavoriteAirfield = !this.changeFavoriteAirfield;
        }
    }

    retrieveAllAirfieldsAcceptVfr() {
        this.airfieldService.retrieveAllAirfieldsAcceptVfr()
            .pipe()
            .subscribe(
                (airfields) => {
                    this.airfields = airfields;
                    this.filteredAirfields = this.form.controls['favoriteAirfield'].valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            const name = typeof value === 'string' ? value : value?.name;
                            return name ? this.airfieldUtils.filter(this.airfields, name as string) : this.airfields.slice();
                        })
                    );
                }
            );
        this.changeFavoriteAirfield = !this.changeFavoriteAirfield;
    }

}

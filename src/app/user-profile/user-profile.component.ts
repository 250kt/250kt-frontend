import {Component, OnInit} from '@angular/core';
import { UserService } from '../service/user.service';
import {User} from "../shared/model/user";
import {Airfield} from "../shared/model/airfield";
import {delay, map, Observable, startWith} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AirfieldService} from "../service/airfield.service";
import {AirfieldUtils} from "../shared/utils/airfield.utils";
import {SnackbarService} from "../service/snackbar.service";
import {SnackbarTiming} from "../shared/model/snackbarTiming";
import {TranslateService} from "@ngx-translate/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {RegexService} from "../service/regex.service";
import {AuthService} from "../service/auth.service";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    animations: [
        trigger('fadeIn', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class UserProfileComponent implements OnInit{

    constructor(
        private readonly userService: UserService,
        private readonly airfieldService: AirfieldService,
        protected readonly airfieldUtils: AirfieldUtils,
        private readonly snackbarService: SnackbarService,
        private readonly translateService: TranslateService,
        private readonly regexService: RegexService,
        private readonly authService: AuthService,
    ) {}

    user?: User;
    airfields!: Airfield[];
    filteredAirfields!: Observable<Airfield[]>;

    formChangeFavoriteAirfield: FormGroup = new FormGroup({
        favoriteAirfield: new FormControl('', [Validators.required]),
    });
    formChangePassword: FormGroup = new FormGroup({
        newPassword: new FormControl('',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$')
            ]),
    });

    isChangeFavoriteAirfield: boolean = false;
    isChangePassword: boolean = false;
    isDeleteAccount: boolean = false;
    isAddAircraft: boolean = false;

    ngOnInit() {
        this.getUserProfile();
    }

    getUserProfile() {
        this.userService.getUserProfile().pipe(delay(500)).subscribe((user: User) => {
            this.user = user;
            this.formChangeFavoriteAirfield.controls['favoriteAirfield'].setValue(user.favoriteAirfield);
        });
    }

    updateFavoriteAirfield() {
        if (this.formChangeFavoriteAirfield.valid) {
           this.userService.updateFavoriteAirfield(this.formChangeFavoriteAirfield.controls['favoriteAirfield'].value).subscribe(
               {
                     next: () => {
                         this.getUserProfile();
                         this.snackbarService.openSnackBar(this.translateService.instant('profile.favorite-airfield.success'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);

                     },
                    error: (error) => {
                        this.snackbarService.openSnackBar(this.translateService.instant('profile.favorite-airfield.error'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);

                    }
               });
           this.isChangeFavoriteAirfield = !this.isChangeFavoriteAirfield;
        }
    }

    cancelUpdateFavoriteAirfield() {
        this.isChangeFavoriteAirfield = !this.isChangeFavoriteAirfield;
    }

    retrieveAllAirfieldsAcceptVfr() {
        this.airfieldService.retrieveAllAirfieldsAcceptVfr()
            .pipe()
            .subscribe(
                (airfields) => {
                    this.airfields = airfields;
                    this.filteredAirfields = this.formChangeFavoriteAirfield.controls['favoriteAirfield'].valueChanges.pipe(
                        startWith(''),
                        map(value => {
                            const name = typeof value === 'string' ? value : value?.name;
                            return name ? this.airfieldUtils.filter(this.airfields, name as string) : this.airfields.slice();
                        })
                    );
                }
            );
        this.isChangeFavoriteAirfield = !this.isChangeFavoriteAirfield;
    }

    confirmEmail() {
        this.userService.sendConfirmEmail().subscribe(
            {
                next: () => {
                    this.snackbarService.openSnackBar(this.translateService.instant('profile.confirm-email.send-success'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                },
                error: () => {
                    this.snackbarService.openSnackBar(this.translateService.instant('profile.confirm-email.send-error'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                }
            });
    }

    wantUpdatePassword() {
        this.isChangePassword = !this.isChangePassword;
    }

    updatePassword() {
        if(this.formChangePassword.valid && this.regexService.checkPassword(this.formChangePassword.controls['newPassword'].value)){
            this.userService.changePassword(this.formChangePassword.controls['newPassword'].value).subscribe(
                {
                    next: () => {
                        this.snackbarService.openSnackBar(this.translateService.instant('profile.new-password.success'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                        this.isChangePassword = !this.isChangePassword;
                    },
                    error: () => {
                        this.snackbarService.openSnackBar(this.translateService.instant('profile.new-password.error'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                    }
                });
        }
    }

    getPasswordErrorMessage(): string {
        if (this.formChangePassword.get('newPassword')?.hasError('required')) {
            return this.translateService.instant('register.passwordRequired');
        }
        if (this.formChangePassword.get('newPassword')?.hasError('minlength')) {
            return this.translateService.instant('register.passwordMinLength');
        }
        if (this.formChangePassword.get('newPassword')?.hasError('pattern')) {
            return this.regexService.validatePasswordLive(this.formChangePassword.controls['newPassword'].value);
        }
        return '';
    }

    wantDeleteAccount() {
        this.isDeleteAccount = !this.isDeleteAccount;
    }

    deleteAccount() {
        this.userService.deleteAccount().subscribe(
            {
                next: () => {
                    this.authService.logout();
                    this.snackbarService.openSnackBar(this.translateService.instant('profile.delete-account.success'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                },
                error: () => {
                    this.snackbarService.openSnackBar(this.translateService.instant('profile.delete-account.error'), this.translateService.instant('general.close'), SnackbarTiming.SHORT);
                }
            });
    }

}

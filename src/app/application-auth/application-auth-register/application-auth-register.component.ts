import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RouterService} from "../../service/router.service";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";
import {SnackbarService} from "../../service/snackbar.service";
import {TranslateService} from "@ngx-translate/core";
import {RegexService} from "../../service/regex.service";
import {AirfieldService} from "../../service/airfield.service";
import {map, Observable, startWith} from "rxjs";
import {Airfield} from "../../shared/model/airfield";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AirfieldUtils} from "../../shared/utils/airfield.utils";

@Component({
  selector: 'app-application-auth-register',
  templateUrl: './application-auth-register.component.html',
})
export class ApplicationAuthRegisterComponent implements OnInit {

    constructor(
       private readonly authService: AuthService,
       private snackBarService: SnackbarService,
       private routerService: RouterService,
       private translate: TranslateService,
       private regexService: RegexService,
       private airfieldService: AirfieldService,
       protected readonly airfieldUtils: AirfieldUtils
    ) {}

    form: FormGroup = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_]*$'),
            Validators.minLength(2)
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        favoriteAirfield: new FormControl('', [Validators.required]),
        password: new FormControl('',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$')
            ]),
    });

    hide: boolean = true;
    airfields!: Airfield[];
    filteredAirfields!: Observable<Airfield[]>;

    ngOnInit(): void {
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
                        }),
                    );
                }
            );
    }

    onSubmit(){
        if(!this.checkForm()){
            return;
        }

        if(!this.regexService.checkEmail(this.form.value.email) || !this.regexService.checkPassword(this.form.value.password)){
            return;
        }

        const user = {
            username: this.form.value.username,
            email: this.form.value.email,
            favoriteAirfield: this.form.value.favoriteAirfield,
            password: this.form.value.password
        }

        this.authService.register(user).subscribe(
            (authenticate) => {
                this.authService.saveToken(authenticate.access_token);
                this.routerService.navigateTo('/home')
            },
            (error) => {
                this.snackBarService.openSnackBar(
                    this.translate.instant('register.error'),
                    this.translate.instant('general.close'),
                    SnackbarTiming.MEDIUM
                )
            }
        )

    }

    checkForm(): boolean {
        return this.form.valid;
    }

    getPasswordErrorMessage(): string {
        if (this.form.get('password')?.hasError('required')) {
            return this.translate.instant('register.passwordRequired');
        }
        if (this.form.get('password')?.hasError('minlength')) {
            return this.translate.instant('register.passwordMinLength');
        }
        if (this.form.get('password')?.hasError('pattern')) {
            return this.regexService.validatePasswordLive(this.form.value.password);
        }
        return '';
    }

    getEmailErrorMessage(): string {
        if (this.form.get('email')?.hasError('required')) {
            return this.translate.instant('register.emailRequired');
        }
        if (this.form.get('email')?.hasError('email')) {
            return this.translate.instant('register.emailPattern');
        }
        return '';
    }

    getUsernameErrorMessage(): string {
        if (this.form.get('username')?.hasError('required')) {
            return this.translate.instant('register.usernameRequired');
        }
        if (this.form.get('username')?.hasError('minlength')) {
            return this.translate.instant('register.usernameMinLength');
        }
        if (this.form.get('username')?.hasError('pattern')) {
            return this.translate.instant('register.usernamePattern');
        }
        return '';
    }

}

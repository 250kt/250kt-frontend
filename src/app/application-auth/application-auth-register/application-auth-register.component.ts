import {Component} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RouterService} from "../../service/router.service";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";
import {SnackbarService} from "../../service/snackbar.service";
import {TranslateService} from "@ngx-translate/core";
import {PasswordService} from "../../service/password.service";

@Component({
  selector: 'app-application-auth-register',
  templateUrl: './application-auth-register.component.html',
})
export class ApplicationAuthRegisterComponent {

    constructor(
       private readonly authService: AuthService,
       private snackBarService: SnackbarService,
       private routerService: RouterService,
       private translate: TranslateService,
       private passwordService: PasswordService
    ) {}

    form: FormGroup = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_]*$'),
            Validators.minLength(2)
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$')
            ]),
    });

    hide: boolean = true;
    regexEmail = new RegExp('^((?:[A-Za-z0-9!#$%&\'*+\\-\\/=?^_`{|}~]|(?<=^|\\.)\"|\"(?=$|\\.|@)|(?<=\".*)[ .](?=.*\")|(?<!\\.)\\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\\.(?:[A-Za-z0-9]){2,})$');

    onSubmit(){
        if(!this.checkForm()){
            return;
        }

        if(!this.checkEmail(this.form.value.email) || !this.checkPassword(this.form.value.password)){
            return;
        }

        const user = {
            username: this.form.value.username,
            email: this.form.value.email,
            password: this.passwordService.encodePassword(this.form.value.password)
        }

        this.authService.register(user).subscribe(
            (authenticate) => {
                this.authService.saveToken(authenticate.access_token);
                this.routerService.navigateTo('/home')
            },
            (error) => {
                //Todo: error register management (email already used, username already used, etc...)
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

    checkPassword(password: string): boolean {

        const regexPassword = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$');

        if(!regexPassword.test(password)){
            this.snackBarService.openSnackBar(
                this.translate.instant('register.passwordPattern'),
                this.translate.instant('general.close'),
                SnackbarTiming.MEDIUM)
            return false;
        }

        return true;
    }

    checkEmail(email: string): boolean {
        this.form.get('email')?.setErrors({invalid: true});

        if(!this.regexEmail.test(email)){
            this.snackBarService.openSnackBar(
                this.translate.instant('register.emailPattern'),
                this.translate.instant('general.close'),
                SnackbarTiming.LONG
            )
            return false;
        }
        return true;
    }

    getPasswordErrorMessage(): string {
        if (this.form.get('password')?.hasError('required')) {
            return this.translate.instant('register.passwordRequired');
        }
        if (this.form.get('password')?.hasError('minlength')) {
            return this.translate.instant('register.passwordMinLength');
        }
        if (this.form.get('password')?.hasError('pattern')) {
            return this.passwordService.validatePasswordLive(this.form.value.password);
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

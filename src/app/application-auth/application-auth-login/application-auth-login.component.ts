import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/model/user";
import {AuthService} from "../../service/auth.service";
import {RouterService} from "../../service/router.service";
import * as bcrypt from "bcryptjs";
import {SnackbarService} from "../../service/snackbar.service";
import {TranslateService} from "@ngx-translate/core";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";

@Component({
  selector: 'app-application-auth-login',
  templateUrl: './application-auth-login.component.html'
})
export class ApplicationAuthLoginComponent {

    constructor(
        private readonly authService: AuthService,
        private snackBarService: SnackbarService,
        private routerService: RouterService,
        private translate: TranslateService,
    ) {}

    form: FormGroup = new FormGroup({
        identifier: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    hide: boolean = true;

    onSubmit(){
        if(!this.checkForm()){
            return;
        }

        const user: User = this.constructUser();

        this.authService.login(user).subscribe(
            (authenticate) => {
                this.authService.saveToken(authenticate.access_token);
                this.routerService.navigateTo('/home')
            },
        () => {
                this.snackBarService.openSnackBar(

                    this.translate.instant('login.error'),
                    this.translate.instant('general.close'),
                    SnackbarTiming.MEDIUM
                )
            });
    }

    checkForm(): boolean {
        return this.form.valid;
    }

    constructUser(): User {
        const regexEmail = new RegExp('^((?:[A-Za-z0-9!#$%&\'*+\\-\\/=?^_`{|}~]|(?<=^|\\.)\"|\"(?=$|\\.|@)|(?<=\".*)[ .](?=.*\")|(?<!\\.)\\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\\.(?:[A-Za-z0-9]){2,})$');

        const user: User = {
            password: this.encodePassword(this.form.value.password)
        }

        if(!regexEmail.test(this.form.value.identifier)){
            user.username = this.form.value.identifier;
        }else{
            user.email = this.form.value.identifier;
        }
        return user;
    }

    encodePassword(password: string): string {
        return bcrypt.hashSync(password);
    }


}

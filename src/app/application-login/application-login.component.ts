import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../shared/model/user";
import {AuthService} from "../service/auth.service";
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterService} from "../service/router.service";

@Component({
  selector: 'app-application-login',
  templateUrl: './application-login.component.html'
})
export class ApplicationLoginComponent {

    constructor(
        private readonly authService: AuthService,
        private snackBar: MatSnackBar,
        private routerService: RouterService
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
                console.log('Login successful');
                this.routerService.navigateTo('/home')
            },
        () => {
                console.log('Login failed');
                this.snackBar.open('Login failed', 'Close', {
                    duration: 10000
                });
            });
    }

    checkForm(): boolean {
        return this.form.valid;
    }

    constructUser(): User {
        const regexEmail = new RegExp('^((?:[A-Za-z0-9!#$%&\'*+\\-\\/=?^_`{|}~]|(?<=^|\\.)\"|\"(?=$|\\.|@)|(?<=\".*)[ .](?=.*\")|(?<!\\.)\\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\\.(?:[A-Za-z0-9]){2,})$');

        const user: User = {
            password: btoa(this.form.value.password)
        }

        if(!regexEmail.test(this.form.value.identifier)){
            user.username = this.form.value.identifier;
        }else{
            user.email = this.form.value.identifier;
        }
        return user;
    }
}

import { Component } from '@angular/core';
import {AuthService} from "../service/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RouterService} from "../service/router.service";
@Component({
  selector: 'app-application-register',
  templateUrl: './application-register.component.html',
})
export class ApplicationRegisterComponent {

    constructor(
       private readonly authService: AuthService,
       private snackBar: MatSnackBar,
       private routerService: RouterService
    ) {}

    form: FormGroup = new FormGroup({
        username: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
    });

    hide: boolean = true;

    onSubmit(){
        if(!this.checkForm()){
            return;
        }

        if(!this.checkEmail(this.form.value.email) || !this.checkPassword(this.form.value.password, this.form.value.confirmPassword)){
            return;
        }

        const user = {
            username: this.form.value.username,
            email: this.form.value.email,
            password: this.encodePassword(this.form.value.password)
        }

        this.authService.register(user).subscribe(
            (authenticate) => {
                this.authService.saveToken(authenticate.access_token);
                console.log('Register successful');
                this.routerService.navigateTo('/home')
            },
            () => {
                console.log('Register failed');
                this.snackBar.open('Register failed', 'Close', {
                    duration: 10000
                });
            }
        )

    }

    checkForm(): boolean {
        return this.form.valid;
    }

    checkPassword(password: string, confirmPassword: string): boolean {

        const regexPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

        if(!regexPassword.test(password) || !regexPassword.test(confirmPassword)){
            this.snackBar.open('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character', 'Close', {
                duration: 10000
            });
            return false;
        }

        if(password !== confirmPassword){
            this.snackBar.open('Passwords do not match', 'Close', {
                duration: 10000
            });
            return false;
        }

        return true;
    }

    checkEmail(email: string): boolean {
        const regexEmail = new RegExp('^((?:[A-Za-z0-9!#$%&\'*+\\-\\/=?^_`{|}~]|(?<=^|\\.)\"|\"(?=$|\\.|@)|(?<=\".*)[ .](?=.*\")|(?<!\\.)\\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\\.(?:[A-Za-z0-9]){2,})$');
        if(!regexEmail.test(email)){
            this.snackBar.open('Invalid email', 'Close', {
                duration: 10000
            });
            return false;
        }
        return true;
    }

    encodePassword(password: string): string {
        return btoa(password);
    }
}

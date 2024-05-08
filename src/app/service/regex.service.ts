import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SnackbarTiming} from "../shared/model/snackbarTiming";
import {SnackbarService} from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class RegexService {

    constructor(
        private translate: TranslateService,
        private snackBarService: SnackbarService,
    ) {}

    validatePasswordLive(password: string): string {
        let errorMessage = this.translate.instant('register.passwordPattern.base');
        let countError = false;
        if (!this.isStringHasLowerCase(password)){
            errorMessage += this.translate.instant('register.passwordPattern.lowercase');
            countError = true;
        }

        if (!this.isStringHasUpperCase(password)){
            errorMessage += countError ? ", " : " ";
            errorMessage += this.translate.instant('register.passwordPattern.uppercase');
            countError = true;
        }

        if (!this.isStringHasNumber(password)){
            errorMessage += countError ? ", " : " ";
            errorMessage += this.translate.instant('register.passwordPattern.number');
            countError = true;
        }

        if(!this.isStringHasSpecialCharacter(password)){
            errorMessage += countError ? ", " : " ";
            errorMessage += this.translate.instant('register.passwordPattern.special');
        }

        return errorMessage;
    }


    isStringHasSpecialCharacter(password: string): boolean {
        const regexpSpecialCharacter = new RegExp('^(?=.*[#?!@$%^&*-])');
        return regexpSpecialCharacter.test(password);
    }

    isStringHasNumber(password: string): boolean {
        const regexHasNumber = new RegExp('^(?=.*[0-9])');
        return regexHasNumber.test(password);
    }

    isStringHasUpperCase(password: string): boolean {
        const regexUpperCase = new RegExp('^(?=.*[A-Z])');
        return regexUpperCase.test(password);
    }

    isStringHasLowerCase(password: string): boolean {
        const regexLowerCase = new RegExp('^(?=.*[a-z])');
        return regexLowerCase.test(password);
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
        const regexEmail = new RegExp('^((?:[A-Za-z0-9!#$%&\'*+\\-\\/=?^_`{|}~]|(?<=^|\\.)\"|\"(?=$|\\.|@)|(?<=\".*)[ .](?=.*\")|(?<!\\.)\\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\\.(?:[A-Za-z0-9]){2,})$');

        if(!regexEmail.test(email)){
            this.snackBarService.openSnackBar(
                this.translate.instant('register.emailPattern'),
                this.translate.instant('general.close'),
                SnackbarTiming.LONG
            )
            return false;
        }
        return true;
    }
}

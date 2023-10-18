import {Injectable} from "@angular/core";
import * as bcrypt from "bcryptjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class PasswordService {

    constructor(
        private translate: TranslateService
    ) {}

    validatePasswordLive(password: string): string {
        let errorMessage = this.translate.instant('register.passwordPattern.title');
        let countError = 0;
        if (!this.isPasswordHasLowerCase(password)){
            errorMessage += this.translate.instant('register.passwordPattern.lowercase');
            countError++;
        }

        if (!this.isPasswordHasUpperCase(password)){
            errorMessage += countError > 0 ? ", " : " ";
            errorMessage += this.translate.instant('register.passwordPattern.uppercase');
            countError++;
        }

        if (!this.isPasswordHasNumber(password)){
            errorMessage += countError > 0 ? ", " : " ";
            errorMessage += this.translate.instant('register.passwordPattern.number');
            countError++;
        }

        if(!this.isPasswordHasSpecialCharacter(password)){
            errorMessage += countError > 0 ? ", " : " ";
            errorMessage += this.translate.instant('register.passwordPattern.special');
        }

        return errorMessage;
    }


    isPasswordHasSpecialCharacter(password: string): boolean {
        const regexpSpecialCharacter = new RegExp('^(?=.*[#?!@$%^&*-])');
        return regexpSpecialCharacter.test(password);
    }

    isPasswordHasNumber(password: string): boolean {
        const regexHasNumber = new RegExp('^(?=.*[0-9])');
        return regexHasNumber.test(password);
    }

    isPasswordHasUpperCase(password: string): boolean {
        const regexUpperCase = new RegExp('^(?=.*[A-Z])');
        return regexUpperCase.test(password);
    }

    isPasswordHasLowerCase(password: string): boolean {
        const regexLowerCase = new RegExp('^(?=.*[a-z])');
        return regexLowerCase.test(password);
    }

    encodePassword(password: string): string {
        return bcrypt.hashSync(password);
    }
}

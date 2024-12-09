import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarTiming} from "../shared/model/snackbarTiming";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(
        private readonly snackBar: MatSnackBar,
    ) {}

    openSnackBar(message: string, action: string, duration: SnackbarTiming) {
        this.snackBar.open(message, action, {
            duration: duration
        });
    }
}

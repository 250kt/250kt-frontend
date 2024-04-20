import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FuelType} from "../shared/model/fuelType";
import {AircraftService} from '../service/aircraft.service';
import {RouterService} from "../service/router.service";
import {SnackbarService} from "../service/snackbar.service";
import {TranslateService} from "@ngx-translate/core";
import {SnackbarTiming} from "../shared/model/snackbarTiming";
import {JwtService} from "../service/jwt.service";

@Component({
  selector: 'app-application-aircraft',
  templateUrl: './application-aircraft.component.html',
})
export class ApplicationAircraftComponent {

    constructor(
        private readonly aircraftService: AircraftService,
        private readonly routerService: RouterService,
        private readonly snackbarService: SnackbarService,
        private readonly translateService:TranslateService,
        private readonly jwtService: JwtService
    ) {
    }

    protected readonly FuelType = FuelType;
    protected readonly enumKeysFuelType = enumKeysFuelType;

    aircraftForm: FormGroup = new FormGroup({
        registration: new FormControl('', Validators.minLength(3)),
        model: new FormControl('', Validators.minLength(3)),
        consumption: new FormControl(''),
        fuelType: new FormControl(FuelType.AVGAS100LL),
        tankCapacity: new FormControl(''),
        nonPumpableFuel: new FormControl(''),
        maximumWeight: new FormControl(''),
        unloadedWeight: new FormControl(''),
        trueAirSpeed: new FormControl(''),
    });

    createAircraft() {
        this.aircraftService.createAircraft(this.aircraftForm.value, this.jwtService.getToken()).subscribe({
            next: () => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.creation-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
                this.aircraftForm.reset();
            },
            error: (error) => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.creation-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
                console.error(error);
            }
        });
    }

}

function enumKeysFuelType<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}


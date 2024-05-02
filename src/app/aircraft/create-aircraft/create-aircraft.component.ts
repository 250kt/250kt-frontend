import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FuelType} from "../../shared/model/fuelType";
import {AircraftService} from '../../service/aircraft.service';
import {SnackbarService} from "../../service/snackbar.service";
import {TranslateService} from "@ngx-translate/core";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";
import {JwtService} from "../../service/jwt.service";

@Component({
  selector: 'create-aircraft',
  templateUrl: './create-aircraft.component.html',
})
export class CreateAircraftComponent {

    constructor(
        private readonly aircraftService: AircraftService,
        private readonly snackbarService: SnackbarService,
        private readonly translateService:TranslateService,
        private readonly jwtService: JwtService
    ) {
    }

    protected readonly FuelType = FuelType;
    protected readonly enumKeysFuelType = enumKeysFuelType;

    aircraftForm: FormGroup = new FormGroup({
        registration: new FormControl('', Validators.minLength(3)),
        model: new FormControl('', Validators.minLength(2)),
        consumption: new FormControl(''),
        fuelType: new FormControl(FuelType.AVGAS100LL),
        tankCapacity: new FormControl(''),
        nonPumpableFuel: new FormControl(''),
        maximumWeight: new FormControl(''),
        unloadedWeight: new FormControl(''),
        trueAirSpeed: new FormControl(''),
    });

    createAircraft() {
        this.aircraftForm.value.registration = this.aircraftForm.value.registration.toUpperCase();
        this.aircraftService.createAircraft(this.aircraftForm.value, this.jwtService.getToken()).subscribe({
            next: () => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.creation-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
                this.aircraftForm.reset();
            },
            error: (error) => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.creation-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            }
        });
    }

}

function enumKeysFuelType<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}


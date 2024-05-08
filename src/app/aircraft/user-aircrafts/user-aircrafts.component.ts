import {Component, OnInit} from '@angular/core';
import {AircraftService} from "../../service/aircraft.service";
import {JwtService} from "../../service/jwt.service";
import {Aircraft} from "../../shared/model/aircraft";
import {Observable} from "rxjs";
import {FuelType} from "../../shared/model/fuelType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SnackbarService} from "../../service/snackbar.service";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'user-aircrafts',
  templateUrl: './user-aircrafts.component.html',
})
export class UserAircraftsComponent implements OnInit{

    constructor(
        private readonly aircraftService: AircraftService,
        private readonly jwtService: JwtService,
        private readonly snackbarService: SnackbarService,
        private readonly translateService: TranslateService
    ) {}

    aircrafts$!: Observable<Aircraft[]>;
    selectedAircraft!: Aircraft;

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

    ngOnInit(): void {
        this.aircrafts$ = this.aircraftService.retrieveUserAircrafts()
        this.aircrafts$.pipe().subscribe(aircrafts => {
            if (aircrafts.length > 0) {
                this.selectAircraft(aircrafts[0])
            }
        });
    }

    selectAircraft(aircraft: Aircraft) {
        this.selectedAircraft = aircraft;
        this.aircraftForm.patchValue(aircraft);
    }

    updateAircraft() {
        this.aircraftForm.value.id = this.selectedAircraft.id;
        this.aircraftService.updateAircraft(this.aircraftForm.value).subscribe({
            next: () => {
                this.aircrafts$ = this.aircraftService.retrieveUserAircrafts();
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.update-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            },
            error: (error) => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.update-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            }
        });
    }

    deleteAircraft(){
        this.aircraftService.deleteAircraft(this.selectedAircraft.id).subscribe({
            next: () => {
                this.aircrafts$ = this.aircraftService.retrieveUserAircrafts();
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.delete-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            },
            error: (error) => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.delete-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            }
        })
    }

}

function enumKeysFuelType<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}


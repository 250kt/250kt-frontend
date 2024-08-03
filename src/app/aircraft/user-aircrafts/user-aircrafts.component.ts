import {Component, OnInit, Renderer2} from '@angular/core';
import {AircraftService} from "../../service/aircraft.service";
import {Aircraft} from "../../shared/model/aircraft";
import {FuelType} from "../../shared/model/fuelType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SnackbarService} from "../../service/snackbar.service";
import {SnackbarTiming} from "../../shared/model/snackbarTiming";
import {TranslateService} from "@ngx-translate/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'user-aircrafts',
  templateUrl: './user-aircrafts.component.html',
    animations: [
        trigger('fadeIn', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class UserAircraftsComponent implements OnInit{

    constructor(
        private readonly aircraftService: AircraftService,
        private readonly snackbarService: SnackbarService,
        private readonly translateService: TranslateService,
        private readonly renderer: Renderer2,
    ) {}

    aircrafts: Aircraft[] = [];
    aircraftsPage!: Aircraft[];
    nbAircrafts!: number;
    selectedAircraft!: Aircraft;

    protected readonly FuelType = FuelType;
    protected readonly enumKeysFuelType = enumKeysFuelType;

    formUpdateAircraft: FormGroup = new FormGroup({
        registration: new FormControl('', Validators.minLength(3)),
        model: new FormControl('', Validators.minLength(2)),
        consumption: new FormControl(''),
        fuelType: new FormControl(FuelType.AVGAS100LL),
        tankCapacity: new FormControl(''),
        nonPumpableFuel: new FormControl(''),
        maximumWeight: new FormControl(''),
        unloadedWeight: new FormControl(''),
        trueAirSpeed: new FormControl(''),
        favorite: new FormControl(''),
    });

    formNewAircraft: FormGroup = new FormGroup({
        registration: new FormControl('', Validators.minLength(3)),
        model: new FormControl('', Validators.minLength(2)),
        consumption: new FormControl(''),
        fuelType: new FormControl(FuelType.AVGAS100LL),
        tankCapacity: new FormControl(''),
        nonPumpableFuel: new FormControl(''),
        maximumWeight: new FormControl(''),
        unloadedWeight: new FormControl(''),
        trueAirSpeed: new FormControl(''),
        favorite: new FormControl(''),
    });

    isAddAircraft: boolean = false;


    ngOnInit(): void {
        this.getUserAircrafts();
    }

    getUserAircrafts() {
        this.aircraftService.retrieveUserAircrafts().pipe().subscribe(aircrafts => {
            this.aircraftsPage = aircrafts.slice(0, 5);
            this.aircrafts = aircrafts;
            this.nbAircrafts = aircrafts.length;
            if (aircrafts.length > 0) {
                const favoriteAircraft = aircrafts.find(aircraft => aircraft.favorite);
                if (favoriteAircraft) {
                    this.selectAircraft(favoriteAircraft);
                }else{
                    this.selectAircraft(aircrafts[0]);
                }
            }
        });
    }

    selectAircraft(aircraft: Aircraft) {
        this.selectedAircraft = aircraft;
        this.formUpdateAircraft.patchValue(aircraft);
    }

    updateAircraft() {
        this.formUpdateAircraft.value.id = this.selectedAircraft.id;
        this.aircraftService.updateAircraft(this.formUpdateAircraft.value).subscribe({
            next: () => {
                this.getUserAircrafts();
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
                this.getUserAircrafts();
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.delete-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            },
            error: (error) => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.delete-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            }
        })
    }

    wantAddAircraft() {
        this.isAddAircraft = !this.isAddAircraft;
    }

    createAircraft() {
        this.formNewAircraft.value.registration = this.formNewAircraft.value.registration.toUpperCase();
        this.aircraftService.createAircraft(this.formNewAircraft.value).subscribe({
            next: () => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.creation-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
                this.formNewAircraft.reset();
                this.wantAddAircraft();
                this.getUserAircrafts();
            },
            error: () => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.creation-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            }
        });
    }

    onPageChange(event: PageEvent) {
        const startIndex = event.pageIndex * event.pageSize;
        let endIndex = startIndex + event.pageSize;
        if (endIndex > this.nbAircrafts) {
            endIndex = this.nbAircrafts;
        }
        this.aircraftsPage = this.aircrafts.slice(startIndex, endIndex);
    }


    onMouseEnter(event: Event) {
        const icon = (event.currentTarget as HTMLElement).querySelector('mat-icon');
        if (icon && !icon.classList.contains('text-amber-400')) {
            this.renderer.addClass(icon, 'text-amber-400');
            this.renderer.addClass(icon, 'opacity-50');

        }
    }

    onMouseLeave(event: Event) {
        const icon = (event.currentTarget as HTMLElement).querySelector('mat-icon');
        if (icon && icon.classList.contains('opacity-50')) {
            this.renderer.removeClass(icon, 'text-amber-400');
            this.renderer.removeClass(icon, 'opacity-50');
        }
    }

    updateFavoriteAircraft(aircraft: Aircraft) {
        this.aircraftService.updateFavoriteAircraft(aircraft).subscribe({
            next: () => {
                this.getUserAircrafts();
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.favorite-success'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            },
            error: () => {
                this.snackbarService.openSnackBar(this.translateService.instant('aircraft.favorite-error'), this.translateService.instant('general.close'), SnackbarTiming.LONG);
            }
        });
    }
}

function enumKeysFuelType<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}


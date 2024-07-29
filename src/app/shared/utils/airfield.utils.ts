import {Airfield} from "../model/airfield";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AirfieldUtils{

    displayFn(airfield: Airfield): string {
        return airfield ? airfield.territory.identificationCode + '' + airfield.code + ' - ' + airfield.fullName : '';
    }

    filter(airfields: Airfield[], value: string): Airfield[] {
        const filterValue = value.toLowerCase();

        return airfields.filter(airfield =>
            airfield.territory.identificationCode.concat(airfield.code).toLowerCase().includes(filterValue) ||
            airfield.fullName.toLowerCase().includes(filterValue)
        );
    }

}

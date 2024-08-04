import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationToHoursMinutes',
  standalone: true
})
export class DurationToHoursMinutesPipe implements PipeTransform {

    transform(value: number, ...args: number[]): string {
        if (value < 60) {
            if(value < 10) {
                return `00h0${value}m`;
            }
            return `00h${value}m`;
        }
        const hours = Math.floor(value / 60);
        const minutes = value % 60;

        return `${hours}h ${minutes}m`;
    }

}

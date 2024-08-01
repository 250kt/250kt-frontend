import {Component, EventEmitter, Input, Output} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'map-element-selection-panel',
    templateUrl: 'map-element-selection-panel.component.html',
    animations: [
        trigger('slideInOut', [
            state('void', style({ transform: 'translateX(-100%)' })),
            state('*', style({ transform: 'translateX(0)' })),
            transition(':enter', [
                animate('300ms ease-in')
            ]),
            transition(':leave', [
                animate('300ms ease-out')
            ])
        ])
    ]
})
export class MapElementSelectionPanelComponent {

    @Input() isObstacleShown?: boolean;

    @Output() changeObstacleVisibilityEvent = new EventEmitter<boolean>();

    isFilterShown = false;
    isObstacleToggling = false;

    changeObstacleVisibility(event: Event) {
        if (this.isObstacleToggling){
            event.preventDefault()
            return;
        }
        this.isObstacleToggling = true;

        this.isObstacleShown = !this.isObstacleShown;
        this.changeObstacleVisibilityEvent.emit(this.isObstacleShown);

        setTimeout(() => {
            this.isObstacleToggling = false;
        }, 500);
    }

    toggleFilterMenu() {
        this.isFilterShown = !this.isFilterShown;
    }
}

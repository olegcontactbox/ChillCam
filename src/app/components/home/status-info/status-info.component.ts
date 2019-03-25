import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-status-info',
    templateUrl: './status-info.component.html',
    styleUrls: ['./status-info.component.scss']
})
export class StatusInfoComponent implements OnInit, OnChanges {

    @Input() poseScore = 0;
    @Input() currentWorkPercent = 0;
    @Input() currentExtraWorkTimeCounter = 0;
    @Input() isOnAir = false;

    // statusTexts: string[] = [
    //     `Let's work`,
    //     `Let's chill`,
    // ];
    statusText: string;

    constructor() { }

    ngOnInit() {
        this.statusText = `...`;
    }
    ngOnChanges(): void {
        this.statusText = this.currentWorkPercent === 100 ? `Work time is over. Let's chill!` : `Let's work`;

    }

}

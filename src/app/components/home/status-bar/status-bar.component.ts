import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-status-bar',
    templateUrl: './status-bar.component.html',
    styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnChanges {
    barWidth = 320;
    maxPercent = 100;
    @Input() currentWorkPercent = this.maxPercent;
    markWidth = this.barWidth;
    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(): void {
        this.markWidth = this.barWidth - ((this.barWidth / 100) * this.currentWorkPercent);
    }

}

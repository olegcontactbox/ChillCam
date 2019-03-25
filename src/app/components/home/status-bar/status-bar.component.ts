import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-status-bar',
    templateUrl: './status-bar.component.html',
    styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnChanges {
    // @Input() currentValue = 0;
    // @Input() maxValue = 0;
    barWidth = 320;
    maxPercent = 100;
    @Input() currentWorkPercent = this.maxPercent;
    markWidth = this.barWidth;
    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(): void {
        // this.currentWorkPercent = this.currentValue / (this.maxValue / 100);
        // console.log(this.maxValue, this.currentValue);
        console.log(this.currentWorkPercent);
        this.markWidth = this.barWidth - ((this.barWidth / 100) * this.currentWorkPercent);
        // console.log('mana: %', this.maxPercent - this.currentWorkPercent);

    }

}

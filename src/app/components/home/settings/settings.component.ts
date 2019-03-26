import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnChanges {
    form: FormGroup = this.formBuilder.group({
        workTimeNorm: [0],
        restTimeNorm: [0],
        currentWorkTime: [0],
        currentExtraWorkTime: [0],
    });
    isCurrentWorkInFocus: boolean;
    isCurrentExtraInFocus: boolean;
    @Input() poseScore = 0;
    @Input() workTimeNorm: number;
    @Input() restTimeNorm: number;
    @Input() currentWorkTime: number;
    @Input() currentExtraWorkTime: number;
    @Output() settingsUpdate = new EventEmitter<FormGroup>();
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form.setValue({
            workTimeNorm: this.workTimeNorm / 60000,
            restTimeNorm: this.restTimeNorm / 60000,
            currentWorkTime: this.currentWorkTime / 60000,
            currentExtraWorkTime: this.currentExtraWorkTime / 60000,
        });
        // this.form = this.formBuilder.group({
        //     'workTimeNorm': new FormControl(0, [Validators.required]),
        //     'restTimeNorm': new FormControl(0, [Validators.required]),
        // });
    }
    ngOnChanges(): void {
        this.form.patchValue({
            workTimeNorm: this.workTimeNorm / 60000,
            restTimeNorm: this.restTimeNorm / 60000,
        });
        if (!this.isCurrentWorkInFocus) {
            this.form.patchValue({
                currentWorkTime: Math.floor(this.currentWorkTime / 60000),
            });
        }
        if (!this.isCurrentExtraInFocus) {
            this.form.patchValue({
                currentExtraWorkTime: Math.floor(this.currentExtraWorkTime / 60000),
            });
        }
    }
    onSubmit(): void {
        this.settingsUpdate.emit(this.form);
    }
    onReset(): void {
        this.form.patchValue({
            // workTimeNorm: 50,
            // restTimeNorm: 10,
            currentWorkTime: 0,
            currentExtraWorkTime: 0,
        });
        this.onSubmit();
    }

}

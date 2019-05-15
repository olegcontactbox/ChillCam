import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
const { shell } = require('electron');
const app = require('electron').remote.app;

// const { app } = require('electron');
// const electron = require('electron');
// import { app } from 'electron';


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
    isAutorun: boolean;
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

        const loginSettings = app.getLoginItemSettings();
        this.isAutorun = loginSettings.openAtLogin;

        console.log(loginSettings);
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
    onInfoClick(): void {
        shell.openExternal('https://github.com/olegcontactbox/chillometer/blob/master/README.md');
    }
    onCheckboxClick(event: boolean): void {
        app.setLoginItemSettings({
            openAtLogin: event,
        });
        this.isAutorun = event;
    }

}

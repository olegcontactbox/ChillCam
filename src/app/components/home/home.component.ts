import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { FormGroup } from '@angular/forms';
const notifier = require('node-notifier');

const { session } = require('electron');




@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

    @ViewChild('video')
    public video: ElementRef;
    // @ViewChild('canvas')
    // public canvas: ElementRef;

    pose: posenet.Pose;

    // detectionRate = 6000; // TEST !!! MUST BE 6000
    // restTimeNorm = 12000; // 10 minutes = 600000
    // workTimeNorm = 18000; // 50 minutes = 3000000

    detectionRate = 12000; // TEST !!! MUST BE 6000
    restTimeNorm = 600000; // 10 minutes = 600000
    workTimeNorm = 3000000; // 50 minutes = 3000000

    workToRestRatio = this.workTimeNorm / this.restTimeNorm;

    currentWorkTimeCounter = 0;

    currentExtraWorkTimeCounter = 0;

    startTime: number;

    notification: NodeJS.Timer;
    notificationIntervalTime = 300000;
    // notificationTimeout = 5; // in seconds

    isOnAir = false;

    isSettingsOpened = false;



    constructor() { }

    ngOnInit() {
        this.startTime = Date.now();
        this.storageCheck();
    }

    ngAfterViewInit() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                // this.video.nativeElement.src = window.URL.createObjectURL(stream); //depricated
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play().then(() => {
                    this.getPose();
                });
            });
        }
    }

    storageCheck(): void {
        if (!localStorage.getItem('workTimeNorm') || !localStorage.getItem('restTimeNorm')) {
            localStorage.setItem('workTimeNorm', '3000000');
            localStorage.setItem('restTimeNorm', '600000');
        }
        this.workTimeNorm = +localStorage.getItem('workTimeNorm');
        this.restTimeNorm = +localStorage.getItem('restTimeNorm');

        console.log(localStorage);
    }

    async getPose(): Promise<void> {
        const scaleFactor = 0.50;
        const flipHorizontal = false;
        const outputStride = 16;

        // const multiplier = 0.75; // default argument for load
        // load the posenet model
        const net = await posenet.load();

        const detection = () => {
            net.estimateSinglePose(this.video.nativeElement, scaleFactor, flipHorizontal, outputStride)
                .then(pose => {
                    this.pose = pose;
                    this.doCount();
                    this.isOnAir = true;
                    console.log(pose);
                });
        };
        detection();
        setInterval(detection, this.detectionRate);

    }

    doCount(): void {
        this.currentWorkTimeCounter = this.checkPose() ?
            this.incCounter() :
            this.decCounter();
    }

    checkPose(): boolean {
        const detectionThreshold = 0.1;
        return this.pose.score > detectionThreshold;
    }

    incCounter(): number {
        // console.log('incCounter()', this.currentExtraWorkTimeCounter);
        const increasedCounter = this.currentWorkTimeCounter + this.detectionRate;
        if (increasedCounter > this.workTimeNorm) {
            this.currentExtraWorkTimeCounter += this.detectionRate / 5;
            if (!this.notification) {
                this.notify();
                this.notification = setInterval(this.notify, this.notificationIntervalTime);
            }
        }
        return increasedCounter > this.workTimeNorm ? this.workTimeNorm : increasedCounter;
    }

    decCounter(): number {
        const decreasedCounter = this.currentWorkTimeCounter - (this.detectionRate * this.workToRestRatio);
        if (decreasedCounter > 0) {
            clearInterval(this.notification);
            this.notification = null;
        }
        if (decreasedCounter < 0) {
            this.currentExtraWorkTimeCounter = this.currentExtraWorkTimeCounter - (this.detectionRate * this.workToRestRatio);
            // console.log('dec ', this.detectionRate, this.workToRestRatio);
        }
        return decreasedCounter > 0 ? decreasedCounter : 0;
    }

    get currentWorkPercent(): number {
        return this.currentWorkTimeCounter / (this.workTimeNorm / 100);
    }

    notify(): void {
        notifier.notify(
            {
                title: 'Hey!',
                message: 'You need to chill!',
                // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
                // sound: true, // Only Notification Center or Windows Toasters
                // wait: true // Wait with callback, until user action is taken against notification
                // timeout: x in seconds
            },
            function (err, response) {
                console.log(err, response);
            }
        );
        console.log('msg');
    }

    onSettingsUpdate(settings: FormGroup): void {
        console.log(settings.value, this.workTimeNorm, this.restTimeNorm, this.currentWorkTimeCounter);
        this.workTimeNorm = settings.value.workTimeNorm * 60000;
        this.restTimeNorm = settings.value.restTimeNorm * 60000;

        localStorage.setItem('workTimeNorm', `${this.workTimeNorm}`);
        localStorage.setItem('restTimeNorm', `${this.restTimeNorm}`);

        // this.currentWorkTimeCounter = this.currentWorkTimeCounter === Math.floor(settings.value.currentWorkTime) ?
        // this.currentWorkTimeCounter : settings.value.currentWorkTime * 60000;

        if (!settings.value.currentWorkTime && !settings.value.currentExtraWorkTime) {
            this.currentWorkTimeCounter = 0;
            this.currentExtraWorkTimeCounter = 0;
            return;
        }

        if (Math.floor(this.currentWorkTimeCounter / 60000) !== settings.value.currentWorkTime) { // ???
            this.currentWorkTimeCounter = settings.value.currentWorkTime * 60000;
        }

        if (Math.floor(this.currentExtraWorkTimeCounter / 60000) !== settings.value.currentExtraWorkTime) { // ???
            this.currentExtraWorkTimeCounter = settings.value.currentExtraWorkTime * 60000;
        }

        // this.currentExtraWorkTimeCounter = settings.value.currentExtraWorkTime * 60000;

    }
}

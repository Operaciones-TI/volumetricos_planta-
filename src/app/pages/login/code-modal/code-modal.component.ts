import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'qr-code',
    templateUrl: './code-modal.component.html',
    styleUrls: ['./code-modal.component.css']
})
export class QRCodeComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<QRCodeComponent>) { }

    ngOnInit() { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
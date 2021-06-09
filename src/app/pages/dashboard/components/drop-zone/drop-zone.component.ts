import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.scss'],
})
export class DropZoneComponent implements OnInit {
  @Input() files: File[] = [];
  @Input() caption: string | undefined;
  @Input() type = '*';
  @Input() maxFileSize = 5000000000;
  @Input() multipleFiles = true;
  shortType = '';

  constructor() {}

  ngOnInit(): void {
    this.shortType = this.type.substring(0, 5);
  }

  onSelect(event: any): void {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File): void {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}

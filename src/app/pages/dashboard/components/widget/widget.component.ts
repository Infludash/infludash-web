import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() type: string | undefined;
  @Input() showHeader: boolean | undefined = true;

  constructor() {}

  ngOnInit(): void {}
}

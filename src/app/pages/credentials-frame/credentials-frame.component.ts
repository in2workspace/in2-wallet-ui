import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-credentials-frame',
  templateUrl: './credentials-frame.component.html',
  styleUrls: ['./credentials-frame.component.scss'],
  standalone: true,
  imports:[RouterOutlet]
})
export class CredentialsFrameComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}

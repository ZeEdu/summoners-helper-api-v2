import { Component, Input } from "@angular/core";
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-quick-access-card',
  templateUrl: './quick-access-card.html',
  styleUrl: './quick-access-card.scss',
  imports: [MatCard, MatCardContent, MatIcon, MatCardTitle, MatCardSubtitle],
})
export class QuickAccessCard {
  @Input() leftIcon: string
  @Input() rightIcon: string
  @Input() title: string
  @Input() subtitle: string
  @Input() icon: string

}
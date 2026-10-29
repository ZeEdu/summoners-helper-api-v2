import { Component, Input } from "@angular/core";
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-quick-access-card',
  templateUrl: './quick-access-card.html',
  styleUrl: './quick-access-card.scss',
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    RouterLink
  ],
})
export class QuickAccessCard {
  @Input() leftIcon: string
  @Input() rightIcon: string
  @Input() title: string
  @Input() subtitle: string
  @Input() icon: string
  @Input() link: string
}
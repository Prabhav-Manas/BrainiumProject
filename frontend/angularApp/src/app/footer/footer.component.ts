import { Component, OnInit } from '@angular/core';
import { AuthService } from '../appServices/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  isAuthenticated: boolean = false;
  private authListenerSub: Subscription = new Subscription(); // Initialize with new Subscription

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this._authService.getIsAuth();

    this.authListenerSub = this._authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }
}

`[NOTE]:=> You should use the 'Subscription' in your component to ensure proper cleanup of the observable subscription when the component is destroyed. This helps prevent memory leaks by unsubscribing from the observable, which is especially important in larger applications or components that frequently get created and destroyed. It keeps your application efficient and avoids potential performance issues.`;

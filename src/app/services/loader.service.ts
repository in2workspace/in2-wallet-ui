import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingCount$ = signal(0);

  readonly isLoading$ = computed(() => this.loadingCount$() > 0);

  addLoadingProcess(): void {
    this.loadingCount$.update(count => count + 1);
  }

  removeLoadingProcess(): void {
    this.loadingCount$.update(count => Math.max(0, count - 1));
  }

  resetLoadingCount(): void {
    this.loadingCount$.set(0);
  }
}

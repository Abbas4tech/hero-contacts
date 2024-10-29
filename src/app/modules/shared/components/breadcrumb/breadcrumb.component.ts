import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    UrlSegment,
} from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html',
})
export class Breadcrumb implements OnInit, OnDestroy {
    pages: UrlSegment[] = [];
    routeSubscription: Subscription;

    constructor(private _router: Router, private _route: ActivatedRoute) {}

    ngOnInit(): void {
        console.log('In Init');

        this.updateRouteState();

        this.routeSubscription = this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => ({
                    path: this._router.parseUrl(this._router.url).root.children[
                        'primary'
                    ].segments,
                    queryParams: this._route.snapshot.queryParams,
                }))
            )
            .subscribe((routeState) => {
                console.log('Route State:', routeState);
                this.pages = routeState.path;
            });
    }

    private updateRouteState(): void {
        this.pages = this._router.parseUrl(this._router.url).root.children[
            'primary'
        ].segments;
        console.log('Initial Route State:', this.pages);
    }

    redirect(path: string) {
        this._router.navigate([path]);
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    UrlSegment,
    PRIMARY_OUTLET,
} from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html',
    standalone: false,
})
export class Breadcrumb implements OnInit, OnDestroy {
    pages: UrlSegment[] = [];
    routeSubscription: Subscription = new Subscription();

    constructor(
        private _router: Router,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.updateRouteState();

        this.routeSubscription = this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => ({
                    path: this._router.parseUrl(this._router.url).root.children[
                        PRIMARY_OUTLET
                    ].segments,
                    queryParams: this._route.snapshot.queryParams,
                }))
            )
            .subscribe((routeState) => {
                this.pages = routeState.path;
            });
    }

    private updateRouteState(): void {
        this.pages = this._router.parseUrl(this._router.url).root.children[
            PRIMARY_OUTLET
        ].segments;
    }

    redirect(path: UrlSegment) {
        const redirectTo = this.pages
            .filter((_, i) => i <= this.pages.indexOf(path))
            .map(({ path }) => path)
            .join('/');
        this._router.navigate([`/${redirectTo}`]);
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}

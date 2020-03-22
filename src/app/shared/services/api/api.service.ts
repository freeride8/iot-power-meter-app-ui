import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trimEnd, trimStart } from 'lodash';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../config/config.service';

@Injectable()
export class ApiService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpClient: HttpClient,
    ) {}

    public request<T>(path: string, options?: any, fallbackUrl?: string): Observable<T> {
        options = options || {};

        const method = options.method ? options.method.toUpperCase() : 'GET';

        const requestOptions: any = {
            responseType: 'json',
        };

        const data = options.data || {};

        if (method === 'GET') {
            requestOptions.params = data;
        } else {
            requestOptions.body = data;
        }

        const url = `${trimEnd(this.configService.get('APP_API_URL'), '/')}/${trimStart(path, '/')}`;

        return (this.httpClient.request<T>(method, url, requestOptions) as Observable<any>)
            .pipe(
                catchError((err) => {
                    return observableThrowError(err);
                })
            );
    }
}
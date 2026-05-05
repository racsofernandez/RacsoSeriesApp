import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { 
    UserList, 
    CreateUserListRequest, 
    UpdateUserListRequest, 
    AddSeriesToListRequest, 
    UserListSeries,
    SerieDetalle
} from '../interfaces/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserListService {

    private urlBackend = '';

    constructor(
        private http: HttpClient,
        private config: ConfigService
    ) {
        this.urlBackend = config.config.apiBackendUrl + "/user-lists";
    }

    async getUserLists(userId: string): Promise<UserList[]> {
        const url = `${this.urlBackend}/user/${userId}`;
        try {
            return await firstValueFrom(this.http.get<UserList[]>(url));
        } catch (err) {
            console.error('Error getting user lists', err);
            throw err;
        }
    }

    async createList(request: CreateUserListRequest): Promise<UserList> {
        try {
            return await firstValueFrom(this.http.post<UserList>(this.urlBackend, request));
        } catch (err) {
            console.error('Error creating list', err);
            throw err;
        }
    }

    async updateList(listId: number, request: UpdateUserListRequest): Promise<UserList> {
        const url = `${this.urlBackend}/${listId}`;
        try {
            return await firstValueFrom(this.http.put<UserList>(url, request));
        } catch (err) {
            console.error('Error updating list', err);
            throw err;
        }
    }

    async deleteList(listId: number, userId: string): Promise<void> {
        const url = `${this.urlBackend}/${listId}?user_id=${userId}`;
        try {
            await firstValueFrom(this.http.delete(url));
        } catch (err) {
            console.error('Error deleting list', err);
            throw err;
        }
    }

    async getSeriesFromList(listId: number, userId: string): Promise<UserListSeries[]> {
        const url = `${this.urlBackend}/${listId}/series?user_id=${userId}`;
        try {
            return await firstValueFrom(this.http.get<UserListSeries[]>(url));
        } catch (err) {
            console.error('Error getting series from list', err);
            throw err;
        }
    }

    async addSeriesToList(listId: number, request: AddSeriesToListRequest): Promise<UserList> {
        const url = `${this.urlBackend}/${listId}/series`;
        try {
            return await firstValueFrom(this.http.post<UserList>(url, request));
        } catch (err) {
            console.error('Error adding series to list', err);
            throw err;
        }
    }

    async removeSeriesFromList(listId: number, seriesId: number, userId: string): Promise<void> {
        const url = `${this.urlBackend}/${listId}/series/${seriesId}?user_id=${userId}`;
        try {
            await firstValueFrom(this.http.delete(url));
        } catch (err) {
            console.error('Error removing series from list', err);
            throw err;
        }
    }

    async getFullSeriesDetailsFromList(listId: number, userId: string): Promise<SerieDetalle[]> {
        const url = `${this.urlBackend}/${listId}/series/details?user_id=${userId}`;
        try {
            return await firstValueFrom(this.http.get<SerieDetalle[]>(url));
        } catch (err) {
            console.error('Error getting full series details', err);
            throw err;
        }
    }

    async getListsContainingSeries(seriesId: number, userId: string): Promise<UserList[]> {
        const url = `${this.urlBackend}/series/${seriesId}/lists?user_id=${userId}`;
        try {
            return await firstValueFrom(this.http.get<UserList[]>(url));
        } catch (err) {
            console.error('Error getting lists containing series', err);
            throw err;
        }
    }
}

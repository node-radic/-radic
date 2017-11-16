import { merge } from 'lodash'
import { kindOf } from "./general";

export type StorageType = 'local' | 'session' | 'cookie' | string;

export class Storage {
    static bags: { [name: string]: StorageBag } = {}

    static hasBag(name: string): boolean {
        return typeof Storage.bags[ name ] !== 'undefined';
    }

    static createBag(name: string, storageType: StorageType): StorageBag {
        if ( Storage.hasBag(name) ) {
            throw new Error('StorageBag ' + name + ' already exists');
        }
        return Storage.bags[ name ] = new StorageBag(Storage.make(name, storageType));
    }

    static getBag(name: string): StorageBag {
        if ( ! Storage.hasBag(name) ) {
            throw new Error('StorageBag ' + name + ' does not exist');
        }
        return Storage.bags[ name ];
    }

    static getOrCreateBag(name: string, storageType: StorageType): StorageBag {
        if ( ! Storage.hasBag(name) ) {
            return Storage.createBag(name, storageType);
        }
        return Storage.getBag(name);
    }

    private static make(name: string, storageType: StorageType): IStorageProvider {
        if ( storageType === 'cookie' ) return new CookieStorage(name);
        if ( storageType === 'local' ) return new LocalStorage(name);
        if ( storageType === 'session' ) return new SessionStorage(name);
        throw new Error('Storage provider could not be maked. ... ?')
    }

    static isSupportedProvider(provider: StorageBag): boolean {
        if ( provider instanceof LocalStorage ) {
            return window.localStorage !== undefined
        }
        if ( provider instanceof SessionStorage ) {
            return window.localStorage !== undefined
        }
        if ( provider instanceof CookieStorage ) {
            return window.document.cookie !== undefined
        }
    }
}

export interface IStorageProvider {
    length: number;

    onStoreEvent(callback: Function);

    clear(): void;

    getItem(key: string): any;

    key(index: number): string;

    removeItem(key: string): void;

    setItem(key: string, data: string, expires?: number | Date): void;

    hasItem(key: string): boolean;

    getSize(key: any): string;
}


export interface IStorageBagOptions {
    json?: boolean,
    expires?: number
}

export class StorageMeta implements IStorageBagOptions {

    json: boolean   = true
    expires: number = null

    constructor(options: IStorageBagOptions = {}) {
        merge(this, {
            json   : true,
            expires: null
        }, options);
    }

    merge(options: IStorageBagOptions): this {
        merge(this, options);
        return this;
    }

    static create(options?: IStorageBagOptions): StorageMeta { return new StorageMeta(options); }

    static fromString(meta: string): StorageMeta { return new StorageMeta(JSON.parse(meta)); }

    toString(): string { return JSON.stringify({ json: this.json, expires: this.expires }); }

    expiresIn(minutes: number) { this.expires = Math.floor((Date.now() / 1000) / 60) + minutes; }

    isExpired(): boolean {
        if ( ! this.canExpire() ) {
            return false;
        }
        let now = Math.floor((Date.now() / 1000) / 60);
        return now > this.expires;
    }

    canExpire(): boolean { return this.expires && this.expires !== null && kindOf(this.expires) === "number"; }

    isJSON(): boolean { return this.json === true }

    setJSON(val: boolean) { this.json = val }
}
export type StorageEvent = 'set' | 'del' | 'clear'
export class StorageBag {
    provider: IStorageProvider;
    options: IStorageBagOptions = {
        json   : true,
        expires: null
    }

    constructor(provider: IStorageProvider, options: IStorageBagOptions = {}) {
        this.provider = provider;
        merge(this.options, options);
    }

    on(event:StorageEvent, callback: Function) {
        this.listeners[event].push(callback);
    }

    listeners:{[event:string]:Function[]} = {set: [], del: [], clear: []}

    protected fireEvent(event:StorageEvent, params:any[]=[]){
        this.listeners[event].forEach(listener => listener.apply(this, params));
    }

    get <T extends any>(key: any, defaultReturn: any = null, options: IStorageBagOptions = {}): T {
        if ( ! this.has(key) ) {
            return defaultReturn;
        }
        const meta = StorageMeta.fromString(this.provider.getItem(key + ':meta'));
        if ( meta.canExpire() && meta.isExpired() ) {
            this.del(key);
            return defaultReturn;
        }

        let val = this.provider.getItem(key);
        if ( meta.isJSON() ) {
            val = JSON.parse(val);
        }
        return <T> val;
    }

    set (key: any, val: any, options: IStorageBagOptions = {}) {
        const meta = StorageMeta.create(this.options).merge(options);
        if ( meta.isJSON() ) {
            val = JSON.stringify(val);
        }
        this.provider.setItem(key + ':meta', meta.toString());
        this.provider.setItem(key, val);
        this.fireEvent('set', [key, val, meta]);
    }

    has(key) {
        return this.provider.hasItem(key);
    }


    /**
     * Delete a value from the storage
     * @param {string|number} key
     */
    del(key) {
        this.provider.removeItem(key);
        this.provider.removeItem(key + ':meta');
        this.fireEvent('del', [key]);
    }

    /**
     * Clear the storage, will clean all saved items
     */
    clear() {
        this.provider.clear();
        this.fireEvent('clear');
    }


    /**
     * Get total localstorage size in MB. If key is provided,
     * it will return size in MB only for the corresponding item.
     * @param [key]
     * @returns {string}
     */
    getSize(key: any): string {
        return this.provider.getSize(key);
    }
}


export abstract class BaseStorageProvider {
    constructor(public name: string) {}
}

export class LocalStorage extends BaseStorageProvider implements IStorageProvider {
    hasItem(key: string): boolean {
        return window.localStorage.getItem(key) !== null;
    }

    get length(): number {
        return window.localStorage.length;
    }

    getSize(key: any): string {
        key = key || false;
        if ( key ) {
            return ((window.localStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        }
        else {
            var total = 0;
            for ( var x in window.localStorage ) {
                total += (window.localStorage[ x ].length * 2) / 1024 / 1024;
            }
            return total.toFixed(2);
        }
    }

    onStoreEvent(callback: Function) {
        if ( window.addEventListener ) {
            window.addEventListener("storage", <any> callback, false);
        }
        else {
            window[ 'attachEvent' ]("onstorage", <any> callback);
        }
    }

    clear(): void {
        window.localStorage.clear();
    }

    getItem(key: string): any {
        return window.localStorage.getItem(key);
    }

    key(index: number): string {
        return window.localStorage.key(index);
    }

    removeItem(key: string): void {
        window.localStorage.removeItem(key);
    }

    setItem(key: string, data: string): void {
        window.localStorage.setItem(key, data);
    }
}

export class SessionStorage extends BaseStorageProvider implements IStorageProvider {

    hasItem(key: string): boolean {
        return window.sessionStorage.getItem(key) !== null;
    }

    get length() {
        return window.sessionStorage.length;
    }

    getSize(key: any): string {
        key = key || false;
        if ( key ) {
            return ((window.sessionStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        }
        else {
            var total = 0;
            for ( var x in window.sessionStorage ) {
                total += (window.sessionStorage[ x ].length * 2) / 1024 / 1024;
            }
            return total.toFixed(2);
        }
    }

    onStoreEvent(callback: Function) {
        if ( window.addEventListener ) {
            window.addEventListener("storage", <any> callback, false);
        }
        else {
            window[ 'attachEvent' ]("onstorage", <any> callback);
        }
    }

    clear(): void {
        window.sessionStorage.clear();
    }

    getItem(key: string): any {
        return window.sessionStorage.getItem(key);
    }

    key(index: number): string {
        return window.sessionStorage.key(index);
    }

    removeItem(key: string): void {
        window.sessionStorage.removeItem(key);
    }

    setItem(key: string, data: string): void {
        window.sessionStorage.setItem(key, data);
    }
}

export class CookieStorage extends BaseStorageProvider implements IStorageProvider {
    get length() {
        return this.keys().length;
    }

    getSize(key: any): string {
        key = key || false;
        if ( key ) {
            return ((window.sessionStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        }
        else {
            var total = 0;
            for ( var x in window.sessionStorage ) {
                total += (window.sessionStorage[ x ].length * 2) / 1024 / 1024;
            }
            return total.toFixed(2);
        }
    }

    cookieRegistry: any[] = [];

    protected listenCookieChange(cookieName, callback) {
        setInterval(() => {
            if ( this.hasItem(cookieName) ) {
                if ( this.getItem(cookieName) != this.cookieRegistry[ cookieName ] ) {
                    // update registry so we dont get triggered again
                    this.cookieRegistry[ cookieName ] = this.getItem(cookieName);
                    return callback();
                }
            }
            else {
                this.cookieRegistry[ cookieName ] = this.getItem(cookieName);
            }
        }, 100);
    }


    onStoreEvent(callback: Function) {
        this.keys().forEach((name: string) => {
            this.listenCookieChange(name, callback);
        })
    }

    clear(): void {
        this.keys().forEach((name: string) => {
            this.removeItem(name);
        })
    }

    key(index: number): string {
        return this.keys()[ index ];
    }


    getItem(sKey) {
        if ( ! sKey ) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }

    setItem(sKey: any, sValue: any, vEnd?: any, sPath?: any, sDomain?: any, bSecure?: any): void {
        if ( ! sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey) ) {
            return;
        }
        var sExpires = "";
        if ( vEnd ) {
            switch ( vEnd.constructor ) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return;
    }


    removeItem(key: string, sPath?: any, sDomain?: any) {
        if ( ! this.hasItem(key) ) {
            return false;
        }
        document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    }

    hasItem(sKey) {
        if ( ! sKey ) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }

    keys() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for ( var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx ++ ) {
            aKeys[ nIdx ] = decodeURIComponent(aKeys[ nIdx ]);
        }
        return aKeys;
    }

}


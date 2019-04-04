import { Injectable } from '@angular/core';
import { KJUR } from 'jsrsasign';
import { AppSettings } from './app.settings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }


  public getProfileId(): string {
    return localStorage.getItem('compapiChat.profileId');
  }

  public setProfileId(profileId): void {
    localStorage.setItem('compapiChat.profileId', profileId);
  }

  public clearProfileId(): void {
    localStorage.removeItem('compapiChat.profileId');
  }

  public authChallenge(options): Promise<string> {

    // Header
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    // Payload
    const tNow = KJUR.jws.IntDate.get('now');
    const tEnd = KJUR.jws.IntDate.get('now + 1day');
    const oPayload = {
      sub: this.getProfileId() || AppSettings.SUB,
      nonce: options.nonce,
      iss: AppSettings.ISSUER,
      aud: AppSettings.AUDIENCE,
      iat: tNow,
      exp: tEnd,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: AppSettings.SECRET });

    return Promise.resolve(sJWT);
  }
}

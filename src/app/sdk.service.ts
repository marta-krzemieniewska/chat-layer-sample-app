import { Injectable } from '@angular/core';
import { IAuthChallengeOptions, LogPersistences, OrphanedEventPersistences } from '@comapi/sdk-js-foundation';
import { ComapiChatClient, ComapiChatConfig } from '@comapi/sdk-js-chat';
import { AuthService } from './auth.service';
// import { ConversationStore } from '???';
import { AppSettings } from './app.settings';

@Injectable({
  providedIn: 'root'
})
export class SdkService {
  private chatClient: ComapiChatClient;
  private config: ComapiChatConfig;
  private convStore;

  constructor(private authService: AuthService) {

    // create / initialise ComapiChatConfig
    this.config = new ComapiChatConfig()
      .withStore(this.convStore)
      .withApiSpace(AppSettings.API_SPACE_ID)
      .withUrlBase(AppSettings.URL_BASE)
      .withWebSocketBase(AppSettings.WEB_SOCKET)
      .withAuthChallenge(this.authChallenge.bind(this));
  }
  private authChallenge(options: IAuthChallengeOptions, answerAuthenticationChallenge) {
    this.authService.authChallenge(options)
      .then(jwt => {
        answerAuthenticationChallenge(jwt);
      });
  }


  public initialise(): Promise<boolean> {
    if (this.chatClient) {
      return Promise.resolve(false);
    } else {
      this.chatClient = new ComapiChatClient();
      return this.chatClient.initialise(this.config);
    }
  }

  public uninitialise(): Promise<boolean> {
    return this.chatClient.uninitialise()
      .then(() => {
        this.chatClient = undefined;
        return true;
      });
  }


}

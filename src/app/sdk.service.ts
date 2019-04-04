import { Injectable } from '@angular/core';
import { IAuthChallengeOptions } from '@comapi/sdk-js-foundation';
import { ComapiChatClient, ComapiChatConfig, MemoryConversationStore } from '@comapi/sdk-js-chat';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { AppSettings } from './app.settings';

@Injectable({
  providedIn: 'root'
})
export class SdkService {
  private chatClient: ComapiChatClient;
  private config: ComapiChatConfig;
  private store: MemoryConversationStore;

  constructor(private authService: AuthService) {
    this.store = new MemoryConversationStore()
    // create / initialise ComapiChatConfig
    this.config = new ComapiChatConfig()
      .withStore(this.store)
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


  public initialise() {
    if (this.chatClient) {
      return of(false);
    } else {
      this.chatClient = new ComapiChatClient();
      return from(this.chatClient.initialise(this.config));
    }
  }

  public uninitialise(): Promise<boolean> {
    return this.chatClient.uninitialise()
      .then(() => {
        this.chatClient = undefined;
        return true;
      });
  }

  public getConversations() {
    return from(this.store.getConversations());
  }
  public getMessages(conversationId: string) {
    return from(this.store.getMessages(conversationId));
  }

  public async subscribeToEvent(event: string, cb: any) {

    this.chatClient.on(event, cb);
  }

  public async unSubscribeToEvent(event: string) {

    this.chatClient.off(event);
  }
  public sendTextMessage(conversationId: string, text: string) {
    return from(this.chatClient.messaging.sendTextMessage(conversationId, text));
  }



}

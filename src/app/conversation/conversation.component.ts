import { Component, OnInit } from '@angular/core';
import { SdkService } from '../sdk.service';
import { ActivatedRoute } from '@angular/router';
import { IConversationMessageEvent } from '@comapi/sdk-js-foundation';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  conversationId: string;
  messages: any;
  messageText: string;

  constructor(private sdk: SdkService, private route: ActivatedRoute) { }

  private handleMessageSentEvent(e) {
    const message = {
      id: e.payload.messageId,
      parts: e.payload.parts
    };
    this.messages.unshift(message);
  }

  private EventIsApplicable(e) {
    return e.conversationId === this.conversationId;
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.conversationId = this.route.snapshot.paramMap.get('id');
        this.getMessages();
      });
  }
  getMessages() {
    this.sdk.getMessages(this.conversationId)
      .subscribe(res => {
        this.messages = res;
      });
  }
  sendMessage(text: string) {
    this.sdk.sendTextMessage(this.conversationId, text)
      .subscribe(result => {
        this.messageText = '';
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { SdkService } from '../sdk.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {

  conversations: any;

  constructor(private sdk: SdkService) { }

  ngOnInit() {
    this.sdk.initialise().subscribe(() => {
      this.sdk.getConversations()
        .subscribe(conversations => {
          this.conversations = conversations;
        });
    }
    );
  }

}

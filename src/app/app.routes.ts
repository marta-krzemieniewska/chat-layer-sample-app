import { Routes } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import { LoginComponent } from './login/login.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ErrorComponent } from './error/error.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'conversations',
        pathMatch: 'full'
    },
    {
        path: 'error/:data',
        component: ErrorComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'conversations',
        component: ConversationsComponent,
        canActivate: [AuthGuardService],
        children: [ {
            path: ':id',
            component: ConversationComponent,
            canActivate: [AuthGuardService]
        }]
    }
];

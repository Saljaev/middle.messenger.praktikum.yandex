import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';

interface ChatInfoMember {
    avatarUrl: string;
    name: string;
}

interface ChatInfoProps extends BlockOwnProps {
    chat: Record<string, unknown>;
    members?: ChatInfoMember[];
}

export class ChatInfoContent extends Block<ChatInfoProps> {
    protected template = `
        <div class="chat-info">
            <div class="chat-info__header">
                <a href="/chat/{{chat.id}}" class="chat-info__back">
                    {{{backIcon}}}
                    <span>Назад</span>
                </a>
            </div>
            <div class="chat-info__profile">
                <div class="avatar avatar--xlarge">
                    <img src="{{chat.avatarUrl}}" alt="{{chat.title}}" class="avatar__image" style="width:120px;height:120px;border-radius:50%;object-fit:cover;">
                </div>
                <h2 class="chat-info__title">{{chat.title}}</h2>
                {{#if chat.membersCount}}
                    <p class="chat-info__status">{{chat.membersCount}} участников</p>
                {{else}}
                    <p class="chat-info__status">{{chat.status}}</p>
                {{/if}}
            </div>
            <div class="chat-info__section">
                <h3 class="chat-info__section-title">Участники</h3>
                <div class="chat-info__members">
                    {{#if members}}
                        {{#each members}}
                            <div class="chat-info__member">
                                <img src="{{this.avatarUrl}}" alt="{{this.name}}" class="avatar__image" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                                <span class="chat-info__member-name">{{this.name}}</span>
                            </div>
                        {{/each}}
                    {{else}}
                        <div class="chat-info__member">
                            <img src="{{chat.avatarUrl}}" alt="{{chat.title}}" class="avatar__image" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                            <span class="chat-info__member-name">{{chat.title}}</span>
                        </div>
                    {{/if}}
                </div>
            </div>
        </div>
    `;

    constructor(props: ChatInfoProps) {
        super({
            ...props,
            backIcon: new Icon({name: 'arrow_back'}),
        });
    }
}

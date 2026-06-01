import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';

interface MessageProps extends BlockOwnProps {
    text: string;
    time: string;
    isOutgoing?: boolean;
    isRead?: boolean;
    senderName?: string;
    senderAvatar?: string;
    showDate?: boolean;
    dateLabel?: string;
}

export class Message extends Block<MessageProps> {
    protected template = `
        <div class="message-wrapper">
            {{#if showDate}}
                <div class="message-date-divider">
                    <span class="message-date-divider__label">{{dateLabel}}</span>
                </div>
            {{/if}}
            <div class="message {{#if isOutgoing}}message--outgoing{{else}}message--incoming{{/if}} {{#if senderName}}message--group{{/if}} {{#if isRead}}message--read{{/if}}">
                <div class="message__content">
                    {{#if senderName}}
                        <div class="message__sender">
                            {{#if senderAvatar}}
                                <img src="{{senderAvatar}}" alt="{{senderName}}" class="avatar__image" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">
                            {{/if}}
                            <span class="message__sender-name">{{senderName}}</span>
                        </div>
                    {{/if}}
                    <div class="message__text">
                        {{text}}
                        <span class="message__meta-inline">
                            <time class="message__time">{{time}}</time>
                            {{#if isOutgoing}}
                                <span class="message__status {{#if isRead}}message__status--read{{/if}}">
                                    {{{checkIcon}}}
                                </span>
                            {{/if}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;

    constructor(props: MessageProps) {
        super({
            isOutgoing: false,
            isRead: false,
            senderName: '',
            senderAvatar: '',
            showDate: false,
            dateLabel: '',
            ...props,
            checkIcon: new Icon({
                name: props.isRead ? 'done_all' : 'check',
                style: 'font-size:14px;',
            }),
        });
    }
}

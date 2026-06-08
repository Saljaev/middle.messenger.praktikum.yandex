import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';
import {Button} from '../../base/button/Button';
import {UserList} from '../../user/user-list/UserList';
import {UserListItem} from '../../user/user-list-item/UserListItem';

interface ChatInfoMember {
    id: number;
    avatarUrl: string;
    name: string;
}

interface ChatInfoProps extends BlockOwnProps {
    chat: Record<string, unknown>;
    members?: ChatInfoMember[];
    isAdmin?: boolean;
    onAddMember?: () => void;
    onRemoveMember?: (userId: number) => void;
}

export class ChatInfoContent extends Block<ChatInfoProps> {
    constructor(props: ChatInfoProps) {
        const addButton = new Button({
            label: '+ Добавить',
            className: 'button_primary chat-info__add-btn',
            onClick: () => props.onAddMember?.(),
        });

        super({
            ...props,
            backIcon: new Icon({name: 'arrow_back'}),
            addButton,
        });
    }

    public setProps(nextProps: Partial<ChatInfoProps>): void {
        const membersChanged =
            nextProps.members !== undefined && nextProps.members !== this.props.members;
        const contextChanged = 'isAdmin' in nextProps || 'onRemoveMember' in nextProps;

        if (membersChanged || contextChanged) {
            const members =
                nextProps.members !== undefined ? nextProps.members : (this.props.members ?? []);
            const isAdmin =
                nextProps.isAdmin !== undefined ? nextProps.isAdmin : this.props.isAdmin;
            const onRemoveMember = nextProps.onRemoveMember ?? this.props.onRemoveMember;

            const items = members.map((m) => {
                let action: Button | undefined;
                if (isAdmin) {
                    action = new Button({
                        label: '×',
                        className: 'button_danger button_icon user-list-item__remove-btn',
                        onClick: () => onRemoveMember?.(m.id),
                    });
                }
                return new UserListItem({
                    id: m.id,
                    avatarUrl: m.avatarUrl,
                    name: m.name,
                    action,
                });
            });

            nextProps = {
                ...nextProps,
                userList: new UserList({
                    items,
                    emptyText: 'Пока нет участников',
                }),
            };
        }

        super.setProps(nextProps);
    }

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
                    <img src="{{chat.avatarUrl}}" alt="{{chat.title}}" class="avatar__image" style="width:120px;height:120px;border-radius:50%;object-fit:cover;" onerror="this.src='https://placehold.co/200/0088cc/white?text=?'">
                </div>
                <h2 class="chat-info__title">{{chat.title}}</h2>
                {{#if chat.membersCount}}
                    <p class="chat-info__status">{{chat.membersCount}} участников</p>
                {{else}}
                    <p class="chat-info__status">{{chat.status}}</p>
                {{/if}}
            </div>
            <div class="chat-info__section">
                <div class="chat-info__section-header">
                    <h3 class="chat-info__section-title">Участники</h3>
                    {{#if isAdmin}}
                        {{{addButton}}}
                    {{/if}}
                </div>
                <div class="chat-info__members">
                    {{{userList}}}
                </div>
            </div>
        </div>
    `;
}

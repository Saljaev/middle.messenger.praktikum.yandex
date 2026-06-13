import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';
import {Button} from '../../base/button/Button';
import {UserList} from '../../user/user-list/UserList';
import {UserListItem} from '../../user/user-list-item/UserListItem';
import {PLACEHOLDER_AVATAR_URL} from '@api/const';

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
    onUpdateAvatar?: (file: File) => void;
    onDeleteChat?: () => void;
}

export class ChatInfoContent extends Block<ChatInfoProps> {
    constructor(props: ChatInfoProps) {
        const addButton = new Button({
            label: '+ Добавить',
            className: 'button_primary chat-info__add-btn',
            onClick: () => props.onAddMember?.(),
        });

        let deleteButton: Button | undefined;
        let uploadIcon: Icon | undefined;
        if (props.isAdmin) {
            deleteButton = new Button({
                label: 'Удалить чат',
                className: 'button_danger',
                onClick: () => props.onDeleteChat?.(),
            });
            uploadIcon = new Icon({name: 'upload'});
        }

        super({
            ...props,
            backIcon: new Icon({name: 'arrow_back'}),
            addButton,
            deleteButton,
            uploadIcon,
        });

        this.events = {
            change: this.handleChange.bind(this),
        };
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

    private handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        if (target.id === 'chat-avatar') {
            const file = target.files?.[0];
            if (file) {
                this.props.onUpdateAvatar?.(file);
            }
        }
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
                    {{#if isAdmin}}
                        <label for="chat-avatar" class="avatar-upload__dropzone">
                            <input type="file" id="chat-avatar" name="chat-avatar" accept="image/*" class="visually-hidden">
                            <img src="{{chat.avatarUrl}}" alt="{{chat.title}}" class="avatar__image" style="width:120px;height:120px;border-radius:50%;object-fit:cover;" onerror="this.src='${PLACEHOLDER_AVATAR_URL}'">
                            <div class="avatar-upload__dropzone-overlay">
                                {{{uploadIcon}}}
                                <div class="avatar-upload__dropzone-text">Нажмите для загрузки</div>
                            </div>
                        </label>
                    {{else}}
                        <img src="{{chat.avatarUrl}}" alt="{{chat.title}}" class="avatar__image" style="width:120px;height:120px;border-radius:50%;object-fit:cover;" onerror="this.src='${PLACEHOLDER_AVATAR_URL}'">
                    {{/if}}
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
            {{#if isAdmin}}
            <div class="chat-info__section chat-info__delete-section">
                {{{deleteButton}}}
            </div>
            {{/if}}
        </div>
    `;
}

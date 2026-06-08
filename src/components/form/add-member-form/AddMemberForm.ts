import {Block, BlockOwnProps} from '../../../core/Block';
import {Form} from '../../form/Form';
import {Input} from '../../base/input/Input';
import {Button} from '../../base/button/Button';
import {UserList} from '../../user/user-list/UserList';
import {UserListItem} from '../../user/user-list-item/UserListItem';
import UserAPI from '../../../api/UserAPI';
import {chatsController} from '../../../controllers/ChatsController';

interface AddMemberFormProps extends BlockOwnProps {
    chatId: number;
    onSuccess?: () => void;
}

export class AddMemberForm extends Block<AddMemberFormProps> {
    protected template = `
        <div class="add-member-form">
            <h3 class="add-member-form__title">Добавить участников</h3>
            {{{searchForm}}}
            {{{userList}}}
            {{{addButton}}}
        </div>
    `;

    private addButton: Button;
    private userList: UserList;
    private userListItemMap = new Map<number, UserListItem>();
    private selectedIds = new Set<number>();

    constructor(props: AddMemberFormProps) {
        const searchForm = new Form<{login: string}>({
            id: 'addMemberSearchForm',
            onSubmit: (data) => {
                void this.handleSearch(data.login);
            },
            children: [
                new Input({
                    name: 'login',
                    label: 'Логин пользователя',
                    placeholder: 'Введите логин для поиска',
                    required: true,
                }),
                new Button({
                    label: 'Найти',
                    type: 'submit',
                    className: 'button_primary button_full-width',
                }),
            ],
        });

        const userList = new UserList({
            items: [],
            emptyText: 'Введите логин для поиска',
        });

        const addButton = new Button({
            label: 'Добавить выбранных',
            type: 'button',
            className: 'button_primary button_full-width',
            disabled: true,
            onClick: () => {
                void this.handleAdd();
            },
        });

        super({
            ...props,
            searchForm,
            userList,
            addButton,
        });

        this.userList = userList;
        this.addButton = addButton;

        this.events = {
            change: this.handleChange.bind(this),
        };
    }

    private async handleSearch(login: string): Promise<void> {
        try {
            const users = await UserAPI.searchUser(login);
            if (!users || users.length === 0) {
                this.userListItemMap.clear();
                this.selectedIds.clear();
                this.userList.setProps({
                    items: [],
                    emptyText: 'Пользователи не найдены',
                });
                this.addButton.setProps({
                    disabled: true,
                    label: 'Добавить выбранных',
                });
                return;
            }

            this.userListItemMap.clear();
            this.selectedIds.clear();

            const items = users.map((u) => {
                const item = new UserListItem({
                    id: u.id,
                    avatarUrl: u.avatar
                        ? `https://ya-praktikum.tech/api/v2/resources${u.avatar}`
                        : 'https://placehold.co/200/0088cc/white?text=?',
                    name: u.display_name || `${u.first_name} ${u.second_name}`,
                    selectable: true,
                    selected: false,
                });
                this.userListItemMap.set(u.id, item);
                return item;
            });

            this.userList.setProps({
                items,
                emptyText: '',
            });
            this.addButton.setProps({
                disabled: true,
                label: 'Добавить выбранных',
            });
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    }

    private handleChange(e: Event): void {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' || target.getAttribute('type') !== 'checkbox') {
            return;
        }

        const checkbox = target as HTMLInputElement;
        const userId = parseInt(checkbox.getAttribute('data-user-id') || '', 10);
        if (Number.isNaN(userId)) {
            return;
        }

        const item = this.userListItemMap.get(userId);
        if (!item) {
            return;
        }

        item.setProps({selected: checkbox.checked});
        if (checkbox.checked) {
            this.selectedIds.add(userId);
        } else {
            this.selectedIds.delete(userId);
        }
        this.updateAddButton();
    }

    private updateAddButton(): void {
        const selectedCount = this.selectedIds.size;
        this.addButton.setProps({
            disabled: selectedCount === 0,
            label:
                selectedCount > 0 ? `Добавить выбранных (${selectedCount})` : 'Добавить выбранных',
        });
    }

    private async handleAdd(): Promise<void> {
        if (this.selectedIds.size === 0) {
            return;
        }

        const selectedIds = Array.from(this.selectedIds);

        try {
            const success = await chatsController.addUsersToChat(this.props.chatId, selectedIds);
            if (success) {
                this.props.onSuccess?.();
            }
        } catch (error) {
            console.error('Ошибка при добавлении участников:', error);
        }
    }
}

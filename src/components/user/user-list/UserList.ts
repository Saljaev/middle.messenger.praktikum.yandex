import {Block, BlockOwnProps} from '../../../core/Block';
import {UserListItem} from '../user-list-item/UserListItem';

interface UserListProps extends BlockOwnProps {
    items?: UserListItem[];
    emptyText?: string;
}

export class UserList extends Block<UserListProps> {
    protected template = `
        <div class="user-list">
            {{#if items}}
                {{{items}}}
            {{else}}
                <p class="user-list__empty">{{emptyText}}</p>
            {{/if}}
        </div>
    `;

    constructor(props: UserListProps = {}) {
        super({
            items: [],
            emptyText: 'Нет данных',
            ...props,
        });
    }
}

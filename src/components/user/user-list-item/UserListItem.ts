import {Block, BlockOwnProps} from '../../../core/Block';

interface UserListItemProps extends BlockOwnProps {
    id: number;
    avatarUrl: string;
    name: string;
    action?: Block;
    selected?: boolean;
    selectable?: boolean;
}

export class UserListItem extends Block<UserListItemProps> {
    protected template = `
        {{#if selectable}}
        <label class="user-list-item {{#if selected}}user-list-item--selected{{/if}}" data-user-id="{{id}}">
            <input type="checkbox" class="user-list-item__checkbox" data-user-id="{{id}}" {{#if selected}}checked{{/if}}>
        {{else}}
        <div class="user-list-item" data-user-id="{{id}}">
        {{/if}}
            <img src="{{avatarUrl}}" alt="{{name}}" class="user-list-item__avatar" onerror="this.src='https://placehold.co/200/0088cc/white?text=?'">
            <span class="user-list-item__name">{{name}}</span>
            {{#if action}}{{{action}}}{{/if}}
        {{#if selectable}}
        </label>
        {{else}}
        </div>
        {{/if}}
    `;
}

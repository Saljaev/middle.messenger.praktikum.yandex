import {Block, BlockOwnProps} from '../../../core/Block';
import {Form} from '../../form/Form';
import {Input} from '../../base/input/Input';
import {Button} from '../../base/button/Button';
import {chatsController} from '../../../controllers/ChatsController';
import Router from '../../../router/Router';

interface CreateChatFormProps extends BlockOwnProps {
    onSuccess?: () => void;
}

export class CreateChatForm extends Block<CreateChatFormProps> {
    protected template = `
        <div class="create-chat-form">
            <h3 class="create-chat-form__title">Создать чат</h3>
            {{{form}}}
        </div>
    `;

    constructor(props: CreateChatFormProps = {}) {
        const form = new Form<{title: string}>({
            id: 'createChatForm',
            onSubmit: async (data) => {
                const success = await chatsController.createChat(data.title);
                if (success) {
                    props.onSuccess?.();
                    Router.getInstance().go(window.location.pathname);
                }
            },
            children: [
                new Input({
                    name: 'title',
                    label: 'Название чата',
                    placeholder: 'Введите название',
                    required: true,
                }),
                new Button({
                    label: 'Создать',
                    type: 'submit',
                    className: 'button_primary button_full-width',
                }),
            ],
        });

        super({
            ...props,
            form,
        });
    }
}

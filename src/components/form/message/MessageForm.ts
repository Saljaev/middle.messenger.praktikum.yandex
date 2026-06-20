import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';
import {messageValidator} from '../../../utils/validation';

interface MessageFormProps extends BlockOwnProps {
    onSend?: (text: string) => void;
}

export class MessageForm extends Block<MessageFormProps> {
    protected template = `
        <form class="message-form">
            <div class="message-input">
                <button type="button" class="message-input__attach-btn" title="Прикрепить файл">
                    {{{attachIcon}}}
                </button>
                <input
                    type="text"
                    class="message-input__field"
                    placeholder="Напишите сообщение..."
                    name="message"
                    ref="messageInput"
                >
                <span class="message-input__error" ref="error"></span>
                <button type="button" class="message-input__emoji-btn" title="Эмодзи">
                    {{{emojiIcon}}}
                </button>
                <button type="submit" class="message-input__send-btn" title="Отправить">
                    {{{sendIcon}}}
                </button>
            </div>
        </form>
    `;

    constructor(props: MessageFormProps = {}) {
        super({
            ...props,
            attachIcon: new Icon({name: 'attach_file'}),
            emojiIcon: new Icon({name: 'sentiment_satisfied'}),
            sendIcon: new Icon({name: 'send'}),
        });

        this.events = {
            submit: this.handleSubmit.bind(this),
            focusout: this.handleBlur.bind(this),
        };
    }

    private handleBlur(e: Event): void {
        const target = e.target as HTMLInputElement;
        if (target.name === 'message') {
            const input = this.refs['messageInput'] as HTMLInputElement | undefined;
            const errorSpan = this.refs['error'] as HTMLSpanElement | undefined;
            const value = input?.value.trim() ?? '';
            const error = messageValidator(value);

            if (!error) {
                input?.classList.remove('message-input__field--error');
                if (errorSpan) {
                    errorSpan.textContent = '';
                }
            }
        }
    }

    private validate(): boolean {
        const input = this.refs['messageInput'] as HTMLInputElement | undefined;
        const errorSpan = this.refs['error'] as HTMLSpanElement | undefined;
        const value = input?.value.trim() ?? '';
        const error = messageValidator(value);

        if (error && input && errorSpan) {
            input.classList.add('message-input__field--error');
            errorSpan.textContent = error;
        } else {
            input?.classList.remove('message-input__field--error');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        }

        return !error;
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        const input = this.refs['messageInput'] as HTMLInputElement | undefined;
        const value = input?.value.trim() ?? '';

        if (!this.validate()) {
            return;
        }

        if (this.props.onSend) {
            this.props.onSend(value);
        }
        if (input) {
            input.value = '';
        }
        const errorSpan = this.refs['error'] as HTMLSpanElement | undefined;
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        input?.classList.remove('message-input__field--error');
    }
}

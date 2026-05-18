import {Block, BlockOwnProps} from '../../../core/Block';

interface InputProps extends BlockOwnProps {
    name: string;
    type?: string;
    label?: string;
    value?: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    validate?: (value: string) => string | null;
    onBlur?: (e: Event) => void;
    onFocus?: (e: Event) => void;
    onInput?: (e: Event) => void;
}

export class Input extends Block<InputProps> {
    protected template = `
        <div class="form__group">
            {{#if label}}
                <label for="{{name}}" class="form__label">{{label}}</label>
            {{/if}}
            <input
                type="{{type}}"
                id="{{name}}"
                name="{{name}}"
                ref="{{name}}"
                class="input {{#if error}}input--error{{/if}}"
                placeholder="{{placeholder}}"
                {{#if required}}required{{/if}}
                {{#if readonly}}readonly{{/if}}
            >
            {{#if error}}
                <span class="form__error">{{error}}</span>
            {{/if}}
        </div>
    `;

    private _currentValue: string;

    constructor(props: InputProps) {
        super({
            type: 'text',
            value: '',
            error: '',
            placeholder: '',
            required: false,
            readonly: false,
            ...props,
        });

        this._currentValue = props.value ?? '';

        this.events = {
            input: (e: Event) => {
                this._currentValue = (e.target as HTMLInputElement).value;
                if (props.onInput) {
                    props.onInput(e);
                }
            },
            focusout: (e: Event) => {
                const target = e.target as HTMLInputElement;
                const error = this.runValidation(target.value);
                this.setError(error ?? '');
                if (props.onBlur) {
                    props.onBlur(e);
                }
            },
        };
        if (props.onFocus) {
            this.events.focus = props.onFocus;
        }
    }

    protected componentDidMount(): void {
        const input = this.refs[this.props.name] as HTMLInputElement | undefined;
        if (input) {
            input.value = this._currentValue;
        }
    }

    public getValue(): string {
        return this._currentValue;
    }

    public setValue(value: string): void {
        this._currentValue = value;
        const input = this.refs[this.props.name] as HTMLInputElement | undefined;
        if (input) {
            input.value = value;
        }
    }

    public setError(error: string): void {
        this.setProps({error});
    }

    public getName(): string {
        return this.props.name;
    }

    private runValidation(value: string): string | null {
        if (this.props.validate) {
            return this.props.validate(value);
        }
        return null;
    }

    public validateInput(): string | null {
        const value = this.getValue();
        const error = this.runValidation(value);
        this.setError(error ?? '');
        return error;
    }
}

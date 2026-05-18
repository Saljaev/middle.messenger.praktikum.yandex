import {Block, BlockOwnProps} from '../../core/Block';
import {Input} from '../base/input/Input';

interface FormProps<T = Record<string, string>> extends BlockOwnProps {
    id?: string;
    className?: string;
    onSubmit?: (data: T) => void;
    children?: Block<Record<string, unknown>>[];
    validate?: (data: T) => Partial<Record<keyof T, string>>;
}

export class Form<T = Record<string, string>> extends Block<FormProps<T>> {
    protected template = `
        <form id="{{id}}" class="form {{className}}">
            {{{children}}}
        </form>
    `;

    constructor(props: FormProps<T>) {
        super({
            id: '',
            className: '',
            children: [],
            ...props,
        });

        this.events = {
            submit: this.handleSubmit.bind(this),
        };
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()) as T;

        const children = (this.props.children ?? []) as Block<Record<string, unknown>>[];
        let hasErrors = false;

        children.forEach((child) => {
            if (child instanceof Input) {
                const error = child.validateInput();
                if (error) {
                    hasErrors = true;
                }
            }
        });

        if (this.props.validate) {
            const customErrors = this.props.validate(data);
            children.forEach((child) => {
                if (child instanceof Input) {
                    const name = child.getName() as keyof T;
                    const error = customErrors[name];
                    if (error) {
                        child.setError(error);
                        hasErrors = true;
                    }
                }
            });
        }

        if (hasErrors) {
            return;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(data);
        }
    }
}

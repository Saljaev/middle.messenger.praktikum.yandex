import {Block, BlockOwnProps} from '../../../core/Block';
import {Form} from '../../form/Form';
import {Icon} from '../../base/icon/Icon';
import {Button} from '../../base/button/Button';
import {authController} from '../../../controllers/AuthController';
import Router from '../../../router/Router';

interface SettingsAvatarFormProps extends BlockOwnProps {}

export class SettingsAvatarForm extends Block<SettingsAvatarFormProps> {
    protected template = `
        <div class="avatar-upload">
            <div class="avatar-upload__current">
                <label for="avatar" class="avatar-upload__dropzone" ref="dropzone">
                    <input type="file" id="avatar" name="avatar" accept="image/*" class="visually-hidden" ref="fileInput">
                    <img src="{{avatarUrl}}" alt="{{firstName}}" class="avatar__image" style="width:120px;height:120px;border-radius:50%;object-fit:cover;" onerror="this.src='https://placehold.co/200/0088cc/white?text=?'">
                    <div class="avatar-upload__dropzone-overlay">
                        {{{uploadIcon}}}
                        <div class="avatar-upload__dropzone-text">Нажмите для загрузки</div>
                    </div>
                </label>
            </div>
            {{{form}}}
        </div>
    `;

    constructor(props: SettingsAvatarFormProps = {}) {
        const user = authController.getCurrentUser() ?? {};

        const form = new Form({
            id: 'avatarUploadForm',
            onSubmit: async () => {
                const fileInput = this.refs['fileInput'] as HTMLInputElement | undefined;
                const file = fileInput?.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('avatar', file);
                const success = await authController.updateAvatar(formData);
                if (success) {
                    Router.getInstance().go('/settings');
                }
            },
            children: [
                new Button({
                    label: 'Сохранить',
                    type: 'submit',
                    className: 'button_primary button_full-width',
                }),
            ],
        });

        super({
            ...props,
            avatarUrl: String(
                user.avatar
                    ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
                    : 'https://placehold.co/200/0088cc/white?text=?',
            ),
            firstName: String(user.first_name ?? ''),
            form,
            uploadIcon: new Icon({name: 'upload'}),
        });

        this.events = {
            change: this.handleChange.bind(this),
        };
    }

    private handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        const fileInput = this.refs['fileInput'] as HTMLInputElement | undefined;
        if (target === fileInput || target.id === 'avatar') {
            const file = target.files?.[0];
            if (file) {
                const img = this.element?.querySelector(
                    '.avatar__image',
                ) as HTMLImageElement | null;
                if (img) {
                    img.src = URL.createObjectURL(file);
                }
            }
        }
    }
}

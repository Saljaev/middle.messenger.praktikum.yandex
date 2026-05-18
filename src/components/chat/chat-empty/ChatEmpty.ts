import {Block, BlockOwnProps} from '../../../core/Block';

interface ChatEmptyProps extends BlockOwnProps {}

export class ChatEmpty extends Block<ChatEmptyProps> {
    protected template = `
        <div class="chat-window">
            <div class="chat-window__empty">
                <div class="chat-window__empty-icon">💬</div>
                <h2 class="chat-window__empty-title">Выберите чат</h2>
                <p class="chat-window__empty-text">Начните общение, выбрав чат из списка</p>
            </div>
        </div>
    `;
}

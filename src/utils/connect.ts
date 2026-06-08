import store from '@/core/Store';
import {Block, BlockOwnProps} from '@/core/Block';
import {Indexed} from '@/types';

export function connect<P extends BlockOwnProps = BlockOwnProps>(
    mapStateToProps?: (state: Indexed) => Partial<P>,
) {
    return function (Component: typeof Block<P>): any {
        return class extends (Component as any) {
            constructor(props: P = {} as P) {
                // eslint-disable-next-line constructor-super
                super(props);
                if (mapStateToProps) {
                    const state = mapStateToProps(store.getState());
                    this.setProps(state as Partial<P>);
                }
                store.subscribe(() => {
                    const state = mapStateToProps
                        ? mapStateToProps(store.getState())
                        : store.getState();
                    this.setProps(state as Partial<P>);
                });
            }
        };
    };
}

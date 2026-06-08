import {Indexed} from '@/types';

function merge(lhs: Indexed, rhs: Indexed): Indexed {
    for (let p in rhs) {
        if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
            continue;
        }

        try {
            const rhsVal = rhs[p] as unknown;
            if ((rhsVal as Record<string, unknown>)?.constructor === Object) {
                rhs[p] = merge(lhs[p] as Indexed, rhsVal as Indexed);
            } else {
                lhs[p] = rhs[p];
            }
        } catch {
            lhs[p] = rhs[p];
        }
    }

    return lhs;
}

export default merge;

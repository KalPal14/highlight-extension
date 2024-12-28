import { FieldArrayWithId } from 'react-hook-form';

import { IChangeHighlightForm } from '~/highlight-extension-fe/pages/active-tab-highlights/ui/types/change-highlight-form.interface';

export type THighlightField = FieldArrayWithId<IChangeHighlightForm, 'highlights', 'id'>;

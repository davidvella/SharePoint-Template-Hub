import { ICommandBarItemProps} from 'office-ui-fabric-react/lib/CommandBar';


export interface ITemplateListViewState {
    /**
     * Boolean value to indicate if the component should render in compact mode.
     * Set to false by default
     */
      isCompactMode : boolean;
    /**
     * String value to indicate the view which the list should render.
     */
      selectedView : string;
    /**
     * Collection of command bar items to be used to render on the right side (or left, in RTL).
     */
      menuItem : ICommandBarItemProps[];
    /**
     * String value to used to perform an InLineSearch on the List.
     */
      searchTerms?: string;
  }
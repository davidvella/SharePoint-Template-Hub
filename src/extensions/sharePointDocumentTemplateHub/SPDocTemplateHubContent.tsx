import * as React from 'react';
import '../../_styles/App.css';

import {TemplateListView} from '../../Components/List/List';
import {DocumentPanel} from '../../Components/Panel/DocumentPanel';
import {initializeIcons} from 'office-ui-fabric-react/lib/Icons';
import {DialogContent, DialogFooter} from 'office-ui-fabric-react/lib/Dialog';
import {IDialogContentProps} from './props/IDialogContentProps';
import {PrimaryButton} from 'office-ui-fabric-react/lib/Button';

/*************************************************************************************
 * React Component to the Document Template Hub
 * The Template Hub consists of the ListView of the Document Templates and
 * the panel which users fill in the metadata to create the document.
 *************************************************************************************/
export class SPDocTemplateHubContent extends React.Component < IDialogContentProps,
any > {
    private selectedItem: any;
    constructor(props : any) {
        super(props);
        this.state = {
            showPanel: false
        };
        this.onListItemSelection = this
            .onListItemSelection
            .bind(this);
        initializeIcons(undefined, {disableWarnings: true});
    }

    /**
   * Default React component render method
   */
    public render() {
        return (
            <DialogContent
                title={this.props.title}
                subText={this.props.message}
                onDismiss={this.props.close}
                showCloseButton={true}>
                <div className="list">
                    <TemplateListView onListItemSelection={this.onListItemSelection}/>
                </div>

                <DocumentPanel
                    item={this.state.item}
                    showPanel={this.state.showPanel}
                    header={this.state.itemName}
                    contextList={this.props.contextList}
                    contextWeb={this.props.contextWeb}
                    close={this.props.close}/>

                <DialogFooter>
                    <PrimaryButton
                        onClick={this._showPanel}
                        text="Create"
                        disabled={!this.state.documentSelected}/>
                </DialogFooter>
            </DialogContent>

        );
    }

    /**
   * Make dialog appear
   */
    private _showPanel = () : void => {
        this.setState({showPanel: true, item: this.selectedItem, itemName: this.selectedItem.FileLeafRef});
    }

    /**
     * Handles the selection of documents and the appearance of the panel.
     *
     * @param selectedItems Selection event that passes the selected item(s) from the Template Hub List.
     *
     */
    private onListItemSelection(selectedItems : any) {
        let item = selectedItems[0];
        
        
        if (item != null) {
            this.selectedItem = item;
            this.setState({documentSelected: true});
        }
    }
}

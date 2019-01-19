import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BaseDialog, IDialogConfiguration} from '@microsoft/sp-dialog';
import {SPDocTemplateHubContent} from './SPDocTemplateHubContent';

/*************************************************************************************
 * The Dialog to present the Document Template Hub.
 *************************************************************************************/
export class SPDocTemplateHubDialog extends BaseDialog {
    private _listName : string;
    private _listWeb : string;

    constructor(contextWeb : string, contextList : string) {
        super();
        this._listName = contextList;
        this._listWeb = contextWeb;
    }

  /**
   * Renders the contents of the dialog.
   */
    public render() : void {
        ReactDOM.render(
            <SPDocTemplateHubContent
            title={'SharePoint Document Template Hub'}
            message={'Select a document'}
            close={this.close}
            contextList={this._listName}
            contextWeb={this._listWeb}/>, this.domElement);
    }

}
import {override} from '@microsoft/decorators';
import {Log} from '@microsoft/sp-core-library';
import {BaseListViewCommandSet, Command, IListViewCommandSetListViewUpdatedParameters, IListViewCommandSetExecuteEventParameters} from '@microsoft/sp-listview-extensibility';
import {SPDocTemplateHubDialog} from './SPDocTemplateHubDialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISharePointDocumentTemplateHubCommandSetProperties {
    // This is an example; replace with your own properties
    sampleTextOne : string;
    sampleTextTwo : string;
}

const LOG_SOURCE : string = 'SharePointDocumentTemplateHubCommandSet';

export default class SharePointDocumentTemplateHubCommandSet extends BaseListViewCommandSet < ISharePointDocumentTemplateHubCommandSetProperties > {

    @override
    public onInit() : Promise < void > {
        Log.info(LOG_SOURCE, 'Initialized SharePointDocumentTemplateHubCommandSet');
        return Promise.resolve();
    }

    @override
    public onListViewUpdated(event : IListViewCommandSetListViewUpdatedParameters) : void {}

    @override
    public onExecute(event : IListViewCommandSetExecuteEventParameters) : void {
        const listName = this.context.pageContext.list.title;
        const webUrl = this.context.pageContext.web.absoluteUrl;
        switch (event.itemId) {
            case 'COMMAND_2':
                const dialog:
                SPDocTemplateHubDialog = new SPDocTemplateHubDialog(webUrl, listName);
                dialog
                    .show()
                    .then(() => {
                        location.reload();
                    });
                break;
            default:
                throw new Error('Unknown command');
        }
    }
}

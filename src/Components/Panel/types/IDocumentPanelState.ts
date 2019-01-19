import {IFieldSchema} from "@davidvella/sharepoint-rest-react";

export interface IDocumentPanelState {
    hideDialog : boolean;
    showPanel : boolean;
    isUploadingDocument : boolean;
    uploadPercentage : number;
    isCreateButtonDisabled : boolean;
    fieldsSchema?: IFieldSchema[];
    data?: any;
}
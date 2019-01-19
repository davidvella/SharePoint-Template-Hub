import * as React from 'react';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog';
import {Panel, PanelType} from 'office-ui-fabric-react/lib/Panel';
import {ProgressIndicator} from 'office-ui-fabric-react/lib/ProgressIndicator';
import {ListForm} from '@davidvella/sharepoint-rest-react';
import {LinkedComponent} from 'valuelink';
import {ControlMode} from '@davidvella/sharepoint-rest-react';
import {autobind} from 'office-ui-fabric-react/lib/Utilities';
import {DocumentService, IFieldSchema} from '@davidvella/sharepoint-rest-react';
import {ChunkedFileUploadProgressData} from '@pnp/sp';
import {HostSettings} from '../../HostSettings';
import {IDocumentPanelInputProps} from './types/IDocumentPanelProps';
import {IDocumentPanelState} from './types/IDocumentPanelState';
import {String} from 'typescript-string-operations';

import '../../_styles/App.css';

/*************************************************************************************
 * React Component to render the Document Creation Panel in the Document Template
 * Hub.
 *************************************************************************************/
export class DocumentPanel extends LinkedComponent < IDocumentPanelInputProps,
IDocumentPanelState > {
    private documentService : DocumentService;
    constructor(props : IDocumentPanelInputProps) {
        super(props);
        this.state = {
            hideDialog: true,
            showPanel: this.props.showPanel,
            isUploadingDocument: false,
            uploadPercentage: 0,
            isCreateButtonDisabled: true
        };
        this.documentService = new DocumentService();
    }

    /**
   * Lifecycle hook when component did update after state or property changes
   * @param nextProps
   */
    public componentWillReceiveProps(nextProps : IDocumentPanelInputProps) : void {
        if (this.props.item !== nextProps.item) {
            this.setState({showPanel: nextProps.showPanel});
		}
    }

    /**
   * Default React component render method
   */
    public render() : JSX.Element {
        let {uploadPercentage} = this.state;

        // Style of the Wopi Frame
        const divStyle = {
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            display: 'block',
            height: '180px',
            width: '100%',
            frameborder: '0',
            marginwidth: '0',
            marginheight: '0'
        };

        // If the item item is null (e.g. on page load) set wopi frame to null
        let docWopiFrame: string = this.props.item
            ? this.props.item.ServerRedirectedEmbedUrl
            : null;

        return (
            <div>
                <Panel
                    isOpen={this.state.showPanel}
                    type={PanelType.medium}
                    onDismiss={this._closePanel}
                    headerText={this.props.header}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this._onRenderFooterContent}>
                    {docWopiFrame
                        ? (<iframe
                            name="WebApplicationFrame"
                            src={docWopiFrame}
                            style={divStyle}
                            id="WebApplicationFrame"/>)
                        : ('')}

                    <div className="info-pane-doc-properties">
                        <p className="info-pane-header">Properties</p>
                        <ListForm
                            title=""
                            listName={this.props.contextList}
                            webUrl={this.props.contextWeb}
                            formType={ControlMode.New}
                            onUpdateFields={this._handleFieldUpdate}/>

                        <Dialog
                            hidden={this.state.hideDialog}
                            onDismiss={this._closeDialog}
                            dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Create Document',
                            subText: 'Are you sure you want to create the document?'
                        }}
                            modalProps={{
                            titleAriaId: 'myLabelId',
                            subtitleAriaId: 'mySubTextId',
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}>
                            {this.state.isUploadingDocument
                                ? (<ProgressIndicator
                                    description="Creating document..."
                                    percentComplete={uploadPercentage}/>)
                                : ('')}
                            <DialogFooter>
                                <PrimaryButton
                                    type="submit"
                                    onClick={this._copyFile}
                                    text="Yes"
                                    disabled={this.state.isUploadingDocument}/>
                                <DefaultButton
                                    onClick={this._closeDialog}
                                    text="Cancel"
                                    disabled={this.state.isUploadingDocument}/>
                            </DialogFooter>
                        </Dialog>
                    </div>
                </Panel>
            </div>
        );
    }

    /**
   * Make dialog appear
   */
    private _showDialog = () : void => {
        this.setState({hideDialog: false});
    }

    /**
   * Given the provided document copy the template to the library and set the metadata.
   */
    @autobind
    private async _copyFile() : Promise < void > {
        this.setState({
            ...this.state,
            isUploadingDocument: true
        });
        const result = await this
            .documentService
            .addFileBlob(this.props.contextWeb, this.props.contextList, this.props.item.FileLeafRef, await this.documentService.getFileFromListAsBlob(HostSettings.TemplateHubWebUrl, this.props.item.FileRef), this._progressUpdater, true, 2621440);

        // Set form metadata from upload result.
        await this
            .documentService
            .updateItem(this.props.contextWeb, this.props.contextList, result.data.UniqueId, this.state.fieldsSchema, this.state.data, true);

        this.setState({
            ...this.state,
            isUploadingDocument: false
        });

        this._closeDialog();
        this._closePanel();
        this
            .props
            .close();
    }

    /**
   * Given the UploadProgress callback set the complete percentage in the state for the progress bar.
   */
    private _progressUpdater = (data : ChunkedFileUploadProgressData) : void => {
        var percentComplete = data.currentPointer / data.fileSize;
        this.setState({uploadPercentage: percentComplete});
    }

    private _handleFieldUpdate = (fieldsSchema : IFieldSchema[], data : any) : void => {
        // Map required fields to their representative data and check if they have
        // values.
        let mapSchemaToData = fieldsSchema.filter((field) => field.Required).map(val => {
            return data[val.InternalName];
        });
        let isDisabled = mapSchemaToData.some(this.isEmpty);
        this.setState({fieldsSchema: fieldsSchema, data: data, isCreateButtonDisabled: isDisabled});
    }

    private isEmpty(value, index, array) {
        return (typeof value === "undefined" || value === null || value == "[]" ||String.IsNullOrWhiteSpace(value));
    }

    private _closeDialog = () : void => {
        this.setState({hideDialog: true});
    }

    private _closePanel = () : void => {
        this.setState({showPanel: false, isCreateButtonDisabled: true});
    }

    private _onRenderFooterContent = () : JSX.Element => {
        return (
            <div>
                <PrimaryButton
                    onClick={this._showDialog}
                    text="Create Document"
                    disabled={this.state.isCreateButtonDisabled}/>
            </div>
        );
    }
}

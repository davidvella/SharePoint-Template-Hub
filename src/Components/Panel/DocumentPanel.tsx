import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import '../../_styles/App.css';
import { FormTextField } from '../../Components/Form/FormTextField';
import { Link, LinkedComponent } from 'valuelink';

interface IDocumentPanelInputProps extends React.Props<any> {
	hideDialog: boolean;
	itemName: string;
	showPanel: boolean;
}

export interface IMyFormState {
	firstName: string;
	lastName: string;
}

// https://github.com/OfficeDev/office-ui-fabric-react/issues/3688
export class DocumentPanel extends LinkedComponent<IDocumentPanelInputProps, any> {
	constructor(props: IDocumentPanelInputProps) {
		super(props);
		this.state = {
			hideDialog: this.props.hideDialog,
			itemName: this.props.itemName,
			showPanel: this.props.itemName,
			firstName: '',
			lastName: ''
		};
	}

	public render(): JSX.Element {
		const firstNameLink = this.linkAt('firstName');

		const lastNameLink = this.linkAt('lastName');

		// Add as many checks as you'd like, chain them, validates the boolean.
		return (
			<div>
				<Panel
					isOpen={this.props.showPanel}
					type={PanelType.smallFixedFar}
					onDismiss={this._onClosePanel}
					headerText={this.props.itemName}
					closeButtonAriaLabel="Close"
					onRenderFooterContent={this._onRenderFooterContent}
				>
					<div className="info-pane-doc-properties">
						<p className="info-pane-header">Properties</p>
						<form onSubmit={this._onSubmit}>
							<FormTextField label="Firstname" valueLink={firstNameLink} />
							<FormTextField label="Lastname" valueLink={lastNameLink} />
							
							<Dialog
								hidden={this.state.hideDialog}
								onDismiss={this._closeDialog}
								isBlocking={true}
								dialogContentProps={{
									type: DialogType.normal,
									title: 'Create Document',
									subText: 'Focus will move back to the panel if you press \'OK\' or \'Cancel\'.'
								}}
								modalProps={{
									titleAriaId: 'myLabelId',
									subtitleAriaId: 'mySubTextId',
									isBlocking: false,
									containerClassName: 'ms-dialogMainOverride'
								}}
							>
								<DialogFooter>
									<PrimaryButton type="submit" onClick={this._closeDialog} text="Yes" />
									<DefaultButton onClick={this._closeDialog} text="Cancel" />
								</DialogFooter>
							</Dialog>
						</form>
					</div>
				</Panel>
			</div>
		);
		
	}

	private _onSubmit = (): void => {
		alert('form submitted!');
	}

	private _showDialog = (): void => {
		this.setState({ hideDialog: false });
	}

	private _closeDialog = (): void => {
		this.setState({ hideDialog: true });
	}

	private _onClosePanel = (): void => {
		this.setState({ showPanel: false });
	}

	private _onRenderFooterContent = (): JSX.Element => {
		return (
			<div>
				<DefaultButton
					secondaryText="Opens the Sample Dialog"
					onClick={this._showDialog}
					text="Create Document"
				/>
			</div>
		);
	}
}

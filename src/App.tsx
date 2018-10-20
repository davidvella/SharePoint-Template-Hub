import * as React from 'react';
import './_styles/App.css';

import { DetailsListDocuments } from './Components/List/List';
import { NavBar } from './Components/Navigation/navbar';
import { DocumentPanel } from './Components/Panel/DocumentPanel';

interface IAppStateProps extends React.Props<any> {
	itemName: string;
	showPanel: boolean;
}

class App extends React.Component<IAppStateProps, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			showPanel: false
		};
		this.onListItemSelection = this.onListItemSelection.bind(this);
	}

	onListItemSelection(newItemName: String) {
		this.setState({
			showPanel: true,
			itemName: newItemName
		});
	}

	public render() {
		return (
			<div>
				<div className="app-header">
					<p className="ms-Dialog-title">Document Template Hub</p>
					<p className="info-pane-header">Select document to create</p>
				</div>
				<div className="app-wrapper">
					<NavBar />
					<div className="list-view">
						<DetailsListDocuments onListItemSelection={this.onListItemSelection} />
					</div>
					<DocumentPanel itemName={this.state.itemName} showPanel={this.state.showPanel} hideDialog={true} />
				</div>
			</div>
		);
	}
}

export default App;

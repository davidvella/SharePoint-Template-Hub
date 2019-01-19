import * as React from 'react';
import {Web} from '@pnp/sp';
import {SearchBox} from 'office-ui-fabric-react/lib/SearchBox';
import {CommandBar, ICommandBarItemProps} from 'office-ui-fabric-react/lib/CommandBar';
import {ListView} from '@davidvella/sharepoint-rest-react';
import {HostSettings} from '../../HostSettings';
import '../../_styles/Dropdown.module.scss';
import '../../_styles/List.module.scss';
import '../../_styles/CommandBar.module.scss';
import { ITemplateListViewState } from './types/ITemplateListViewState';
import { IView } from './types/IView';

/*************************************************************************************
 * React Component to render the Document Template Hub List View.
 *************************************************************************************/
export class TemplateListView extends React.Component < any,
ITemplateListViewState > {

    constructor(props : any) {
        super(props);

        this.state = {
            isCompactMode: false,
            selectedView: null,
            menuItem: []
        };

        this.getFarItems(null);
    }

  /**
   * Default React component render method
   */
    public render() {
        const {menuItem, selectedView, searchTerms} = this.state;
        return (
            <div >
                <div>
                    <div>
                        <CommandBar
                            items={this.getSearchBox()}
                            farItems={menuItem}
                            className="ms-commandBar"/>
                    </div>
                </div>
                <div className="ms-List">
                    <ListView
                        webUrl={HostSettings.TemplateHubWebUrl}
                        listName={HostSettings.TemplateHubName}
                        viewId={selectedView}
                        searchTerms={searchTerms}
                        selection={this.props.onListItemSelection}/>
                </div>
            </div>
        );
    }

    // Data for CommandBar
    private getSearchBox = () => {
        return [
            {
                key: 'search',
                onRender: () => (<SearchBox
                    className="searchBox"
                    placeholder="Search"
                    onSearch={(newValue) => this.setState({searchTerms: newValue})}
                    onFocus={() => console.log('onFocus called')}/>)
            }
        ];
    }

    private getFarItems = (selectedViewId : string) => {
        let {menuItem} = this.state;
        let _views : IView[] = [];
        let currentView : string;
        let web = new Web(HostSettings.TemplateHubWebUrl);
        const list = web
            .lists
            .getByTitle(HostSettings.TemplateHubName);
        list
            .views
            .get()
            .then((view) => {
                for (let i = 0; i < view.length; i++) {
                    var item = view[i];
                    if (item.Hidden === false) {
                        const newView : IView = {
                            key: item.Id,
                            name: item.Title,
                            onClick: () => {
                                const viewId : string = newView.key;
                                this.setState({selectedView: viewId});
                                this.getFarItems(viewId);
                            }
                        };
                        if (selectedViewId === null && item.DefaultView === true) {
                            selectedViewId = item.Id;
                            this.setState({selectedView: item.Id});
                        }
                        if (item.Id === selectedViewId) {
                            currentView = item.Title;
                        } else {
                            _views.push(newView);
                        }
                    }
                }
                menuItem = [
                    {
                        key: 'selectedView',
                        name: currentView,
                        cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
                        iconProps: {
                            iconName: 'ViewList'
                        },
                        ariaLabel: 'New. Use left and right arrow keys to navigate',
                        subMenuProps: {
                            items: _views
                        }
                    }, {
                        key: 'tile',
                        name: 'Grid view',
                        iconProps: {
                            iconName: 'Tiles'
                        },
                        iconOnly: true,
                        onClick: () => console.log('Tiles')
                    }, {
                        key: 'info',
                        name: 'Info',
                        iconProps: {
                            iconName: 'Info'
                        },
                        iconOnly: true,
                        onClick: () => console.log('Info')
                    }
                ];

                this.setState({menuItem});
            });
    }

}

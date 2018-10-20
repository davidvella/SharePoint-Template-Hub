import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    DetailsRow,
    IDetailsRowProps,
    Selection,
    SelectionMode,
    ConstrainMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { lorem } from 'office-ui-fabric-react/lib/utilities/exampleData';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';

let _items: IDocument[] = [];

const fileIcons: Array<{ name: string }> = [
    {name: 'accdb'},
    {name: 'csv'},
    {name: 'docx'},
    {name: 'dotx'},
    {name: 'mpp'},
    {name: 'mpt'},
    {name: 'odp'},
    {name: 'ods'},
    {name: 'odt'},
    {name: 'one'},
    {name: 'onepkg'},
    {name: 'onetoc'},
    {name: 'potx'},
    {name: 'ppsx'},
    {name: 'pptx'},
    {name: 'pub'},
    {name: 'vsdx'},
    {name: 'vssx'},
    {name: 'vstx'},
    {name: 'xls'},
    {name: 'xlsx'},
    {name: 'xltx'},
    {name: 'xsn'}
];

export interface IDetailsListDocumentsExampleState {
    columns: IColumn[];
    items: IDocument[];
    selectionDetails: string;
    isModalSelection: boolean;
    isCompactMode: boolean;
    isLoading: boolean;
}

export interface IDocument {
    [key: string]: any;

    name: string;
    value: string;
    iconName: string;
    modifiedBy: string;
    dateModified: string;
    dateModifiedValue: number;
    fileSize: string;
    fileSizeRaw: number;
}

export class DetailsListDocuments extends React.Component<any, IDetailsListDocumentsExampleState> {
    readonly _selection: Selection;

    constructor(props: any) {
        super(props);

        //  Populate with items for demos.
        if (_items.length === 0) {
            for (let i = 0; i < 30; i++) {
                const randomDate = this._randomDate(new Date(2012, 0, 1), new Date());
                const randomFileSize = this._randomFileSize();
                const randomFileType = this._randomFileIcon();
                let fileName: string = lorem(2).replace(/\W/g, '');
                let userName: string = lorem(2).replace(/[^a-zA-Z ]/g, '');
                fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).concat(`.${randomFileType.docType}`);
                userName = userName
                    .split(' ')
                    .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
                    .join(' ');
                _items.push({
                    name: fileName,
                    value: fileName,
                    iconName: randomFileType.url,
                    modifiedBy: userName,
                    dateModified: randomDate.dateFormatted,
                    dateModifiedValue: randomDate.value,
                    fileSize: randomFileSize.value,
                    fileSizeRaw: randomFileSize.rawSize
                });
            }
            _items = this._sortItems(_items, 'name');
        }

        const _columns: IColumn[] = [
            {
                key: 'column1',
                name: 'File Type',
                headerClassName: 'DetailsListExample-header--FileIcon',
                className: 'DetailsListExample-cell--FileIcon',
                iconClassName: 'DetailsListExample-Header-FileTypeIcon',
                ariaLabel: 'Column operations for File type',
                iconName: 'Page',
                isIconOnly: true,
                fieldName: 'name',
                minWidth: 16,
                maxWidth: 16,
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {
                    return <img src={item.iconName} className={'DetailsListExample-documentIconImage'}/>;
                }
            },
            {
                key: 'column2',
                name: 'Name',
                fieldName: 'name',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true
            },
            {
                key: 'column3',
                name: 'Date Modified',
                fieldName: 'dateModifiedValue',
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                onRender: (item: IDocument) => {
                    return <span>{item.dateModified}</span>;
                },
                isPadded: true
            },
            {
                key: 'column4',
                name: 'Modified By',
                fieldName: 'modifiedBy',
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                isCollapsable: true,
                data: 'string',
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {
                    return <span>{item.modifiedBy}</span>;
                },
                isPadded: true
            },
            {
                key: 'column5',
                name: 'File Size',
                fieldName: 'fileSizeRaw',
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                isCollapsable: true,
                data: 'number',
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {
                    return <span>{item.fileSize}</span>;
                }
            }
        ];

        this._selection = new Selection({
            onSelectionChanged: () => {
                this.setState({
                    selectionDetails: this._getSelectionDetails(),
                    isModalSelection: this._selection.isModal()
                });
            }
        });

        this.state = {
            items: _items,
            columns: _columns,
            selectionDetails: this._getSelectionDetails(),
            isModalSelection: this._selection.isModal(),
            isCompactMode: false,
            isLoading: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
        if (
            (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
            this._onDelayedLoadNextPage();
        }
    }

    public render() {
        const {columns, isCompactMode, items} = this.state;
        let {isLoading} = this.state;
        return (
            <div>
                <TextField label="Filter by name:" onChange={this._onChangeText}/>
                <MarqueeSelection selection={this._selection}>
                    <DetailsList
                        items={items}
                        compact={isCompactMode}
                        columns={columns}
                        selectionMode={this.state.isModalSelection ? SelectionMode.single : SelectionMode.none}
                        setKey="set"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        selection={this._selection}
                        selectionPreservedOnEmptyClick={true}
                        onItemInvoked={this._onItemInvoked}
                        enterModalSelectionOnTouch={true}
                        constrainMode={ConstrainMode.horizontalConstrained}
                        onRenderRow={this._onRenderRow}
                    />
                    <Spinner className="loadingSpinner" label="Loading..." hidden={!isLoading}/>
                </MarqueeSelection>
            </div>
        );
    }

    public componentDidUpdate(previousProps: any, previousState: IDetailsListDocumentsExampleState) {
        if (previousState.isModalSelection !== this.state.isModalSelection) {
            this._selection.setModal(this.state.isModalSelection);
        }
    }

    private _onRenderRow = (props: IDetailsRowProps): JSX.Element => {
        return <DetailsRow {...props} aria-busy={false}/>;
    }

    private _onDelayedLoadNextPage() {
        let {isLoading} = this.state;

        if (!isLoading) {
            this.setState({isLoading: true});

            // This setTimeout is only here for illustrating a slow API. Reddit API is pretty fast.
            setTimeout(() => this._onLoadNextPage(), 3000);
        }
    }

    private _onLoadNextPage() {
        this.setState({isLoading: true});
        let {items} = this.state;
        let _newItems: IDocument[] = [];
        for (let i = 0; i < 20; i++) {
            const randomDate = this._randomDate(new Date(2012, 0, 1), new Date());
            const randomFileSize = this._randomFileSize();
            const randomFileType = this._randomFileIcon();
            let fileName: string = lorem(2).replace(/\W/g, '');
            let userName: string = lorem(2).replace(/[^a-zA-Z ]/g, '');
            fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).concat(`.${randomFileType.docType}`);
            userName = userName
                .split(' ')
                .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
                .join(' ');
            _newItems.push({
                name: fileName,
                value: fileName,
                iconName: randomFileType.url,
                modifiedBy: userName,
                dateModified: randomDate.dateFormatted,
                dateModifiedValue: randomDate.value,
                fileSize: randomFileSize.value,
                fileSizeRaw: randomFileSize.rawSize
            });
        }

        items = items.slice(0, items.length - 1).concat(_newItems);

        this.setState({
            items,
            isLoading: false
        });
    }

    private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        this.setState({items: text ? _items.filter((i) => i.name.toLowerCase().indexOf(text) > -1) : _items});
    }

    private _onItemInvoked(item: any): void {
        alert(`Item invoked: ${item.name}`);
    }

    private _randomDate(start: Date, end: Date): { value: number; dateFormatted: string } {
        const date: Date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        const dateData = {
            value: date.valueOf(),
            dateFormatted: date.toLocaleDateString()
        };
        return dateData;
    }

    private _randomFileIcon(): { docType: string; url: string } {
        const docType: string = fileIcons[Math.floor(Math.random() * fileIcons.length) + 0].name;
        return {
            docType,
            url: `https://static2.sharepointonline.com/files/fabric/assets/brand-icons/document/svg/${docType}_16x1.svg`
        };
    }

    private _randomFileSize(): { value: string; rawSize: number } {
        const fileSize: number = Math.floor(Math.random() * 100) + 30;
        return {
            value: `${fileSize} KB`,
            rawSize: fileSize
        };
    }

    private _getSelectionDetails(): string {
        const selectionCount = this._selection.getSelectedCount();

        switch (selectionCount) {
            case 0:
                return 'No items selected';
            case 1:
                var name = (this._selection.getSelection()[0] as any).name;
                this.props.onListItemSelection(name);
                return '1 item selected: ' + name;
            default:
                return `${selectionCount} items selected`;
        }
    }

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const {columns, items} = this.state;
        let newItems: IDocument[] = items.slice();
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
            return column.key === currCol.key;
        })[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        newItems = this._sortItems(newItems, currColumn.fieldName || '', currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            items: newItems
        });
    }

    private _sortItems = (items: IDocument[], sortBy: string, descending = false): IDocument[] => {
        if (descending) {
            return items.sort((a: IDocument, b: IDocument) => {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            });
        } else {
            return items.sort((a: IDocument, b: IDocument) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                return 0;
            });
        }
    }
}

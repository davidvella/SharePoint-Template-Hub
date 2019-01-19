export interface IDocumentPanelInputProps extends React.Props < any > {
    /**
     * The SPItem Object of the document to be created including item's metadata.
     */    
    item: any;
    /**
     * Boolean value to indicate whether the panel should appear or not.
     * Set to false by default
     */    
    showPanel: boolean;
    /**
     * String value to set the panel's header value.
     * Set to false by default
     */  
    header: string;
    /**
     * String value of the current web url where the document is going to be created.
     */  
    contextWeb: string;
    /**
     * String value of the name of the list the document is going to be created.
     */  
    contextList: string;
    /**
     * A callback function which can be used to when the document is created.
     */
    close?: () => void;
}
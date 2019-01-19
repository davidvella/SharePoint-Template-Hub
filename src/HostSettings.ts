declare var _TemplateHubWebUrl_ : string;
declare var _TemplateHubName_ : string;

/*************************************************************************************
 * Configuration file for the Template Hub. Set on build by webpack.
 *************************************************************************************/
export class HostSettings {
    public static get TemplateHubWebUrl() : string {return _TemplateHubWebUrl_;}
    public static get TemplateHubName() : string {return _TemplateHubName_;}
}
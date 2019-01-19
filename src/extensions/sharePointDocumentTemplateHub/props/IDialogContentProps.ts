export interface IDialogContentProps {
    /**
   * The Title text to appear at the top of the dialog.
   */
    title : string;
    /**
   * The subtext to display in the dialog.
   */
    message : string;
    /**
   * A callback function for when the Dialog is dismissed from the close button or light dismiss, before the animation completes
   */
    close : () => void;
    /**
   * The name of the to create the document in.
   */
    contextList : string;
    /**
   * The url of the web to upload the document to.
   */
    contextWeb : string;
}
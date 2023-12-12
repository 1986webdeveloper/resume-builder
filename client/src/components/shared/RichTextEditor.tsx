import PropTypes, { InferProps } from "prop-types";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ComponentPropTypes = {
  setTextAreaData: PropTypes.any,
  defaultData: PropTypes.string,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function RichTextEditor({
  setTextAreaData,
  defaultData = "",
}: ComponentTypes) {
  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        data={defaultData}
        onReady={(editor) => {
          console.log("CKEditor5 React Component is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          setTextAreaData(editor.getData());
        }}
      />
    </div>
  );
}

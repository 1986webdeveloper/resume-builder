import PropTypes, { InferProps } from "prop-types";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ComponentPropTypes = {
  setTextAreaData: PropTypes.any,
  defaultData: PropTypes.string,
  isError: PropTypes.bool,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function RichTextEditor({
  setTextAreaData,
  defaultData = "",
  isError = false,
}: ComponentTypes) {
  return (
    <div className="App dark:text-black">
      <CKEditor
        editor={ClassicEditor}
        data={defaultData}
        onChange={(_, editor) => {
          setTextAreaData(editor.getData());
        }}
      />

      {isError && (
        <p className="text-red-600 mt-2 text-xs">This field is required.</p>
      )}
    </div>
  );
}

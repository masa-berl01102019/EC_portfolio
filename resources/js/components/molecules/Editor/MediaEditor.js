import React, { useState, memo, useEffect } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor } from "react-draft-wysiwyg";
import useHelper from '../../hooks/useHelper';

const MediaEditor = ({
  initialValue = null,
  onChange,
  className = '',
  ...props
}) => {

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { isJson } = useHelper();

  useEffect(() => {
    if (initialValue) {
      // Convert the body of news which is stored as JSON into contentState * Judge if it's HTML or JSON because demo data is stored as HTML
      const contentState = isJson(initialValue) ? convertFromRaw(JSON.parse(initialValue)) : stateFromHTML(initialValue);
      // Convert contentState into editorState
      const editorState = EditorState.createWithContent(contentState);
      // Set editorState to draft.js
      setEditorState(editorState);
    }
  }, []);

  const onEditorStateChange = (editorState) => {
    // Get contentState from editorState
    const contentState = editorState.getCurrentContent();
    // ContentState has to be store as JSON because some of styles don't be stored correctly if it's stored after converting HTML
    const content = JSON.stringify(convertToRaw(contentState));
    // Store contect variable to formData
    onChange(content)
    // Update editorState
    setEditorState(editorState);
  };

  return (
    <div className={className}>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        {...props}
      />
    </div>
  );
};

export default MediaEditor;
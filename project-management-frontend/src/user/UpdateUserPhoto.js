import React from "react";
import { FormGroup, Input, FormFeedback } from "reactstrap";

/**
 * Form for updating the user photo
 */
export default ({ picture, handleUpdateUserPhoto }) => (
  <FormGroup style={{ margin: "5px auto" }}>
    <Input
      type="url"
      value={picture}
      onChange={handleUpdateUserPhoto}
      placeholder="URL"
    />
    <FormFeedback invalid="true" />
  </FormGroup>
);

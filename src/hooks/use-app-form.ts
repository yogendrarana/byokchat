import { createFormHook } from "@tanstack/react-form";
import { createFormHookContexts } from "@tanstack/react-form";

import { Select, SubscribeButton, TextArea, TextField } from "../components/form-components";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext
});

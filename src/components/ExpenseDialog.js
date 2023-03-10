import { useState, useEffect } from "react";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import enGB from "date-fns/locale/en-GB";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import styles from "../styles/expenseDialog.module.scss";

import { useAuth } from "../firebase/auth";
import { uploadImage, replaceImage } from "../firebase/storage";

import { RECEIPTS_ENUM } from "./Dashboard";
import { addReceipt, updateReceipt } from "../firebase/firestore";

const DEFAULT_FILE_NAME = "No file selected";

// Default form state for the dialog
const DEFAULT_FORM_STATE = {
  fileName: DEFAULT_FILE_NAME,
  file: null,
  date: null,
  locationName: "",
  address: "",
  items: "",
  amount: "",
};

/* 
 Dialog to input receipt information
 
 props:
  - edit is the receipt to edit
  - showDialog boolean for whether to show this dialog
  - onError emits to notify error occurred
  - onSuccess emits to notify successfully saving receipt
  - onCloseDialog emits to close dialog
 */
export default function ExpenseDialog(props) {
  const { authUser } = useAuth();

  const isEdit = Object.keys(props.edit).length > 0;
  const [formFields, setFormFields] = useState(
    isEdit ? props.edit : DEFAULT_FORM_STATE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the receipt to edit or whether to close or open the dialog ever changes, reset the form fields
  useEffect(() => {
    if (props.showDialog) {
      setFormFields(isEdit ? props.edit : DEFAULT_FORM_STATE);
    }
  }, [props.edit, props.showDialog]);

  // Check whether any of the form fields are unedited
  const isDisabled = () =>
    formFields.fileName === DEFAULT_FILE_NAME ||
    !formFields.date ||
    formFields.locationName.length === 0 ||
    formFields.address.length === 0 ||
    formFields.items.length === 0 ||
    formFields.amount.length === 0;

  // Update given field in the form
  const updateFormField = (event, field) => {
    setFormFields((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  // Set the relevant fields for receipt image
  const setFileData = (target) => {
    const file = target.files[0];
    setFormFields((prevState) => ({ ...prevState, fileName: file.name }));
    setFormFields((prevState) => ({ ...prevState, file }));
  };

  const closeDialog = () => {
    setIsSubmitting(false);
    props.onCloseDialog();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (isEdit) {
        // Check whether image was changed - fileName will be not null
        if (formFields.fileName) {
          // Store image into Storage
          await replaceImage(formFields.file, formFields.imageBucket);
        }
        await updateReceipt(
          formFields.id,
          authUser.uid,
          formFields.date,
          formFields.locationName,
          formFields.address,
          formFields.items,
          formFields.amount,
          formFields.imageBucket
        );
      } else {
        // Adding receipt
        // Store image into Storage
        const bucket = await uploadImage(formFields.file, authUser.uid);

        // Store data into Firestore
        await addReceipt(
          authUser.uid,
          formFields.date,
          formFields.locationName,
          formFields.address,
          formFields.items,
          formFields.amount,
          bucket
        );
      }
      props.onSuccess(isEdit ? RECEIPTS_ENUM.edit : RECEIPTS_ENUM.add);
    } catch (error) {
      props.onError(isEdit ? RECEIPTS_ENUM.edit : RECEIPTS_ENUM.add);
      console.log(error);
    }
    // Clear all form data
    closeDialog();
  };

  return (
    <Dialog
      classes={{ paper: styles.dialog }}
      onClose={() => closeDialog()}
      open={props.showDialog}
      component="form"
    >
      <Typography variant="h4" className={styles.title}>
        {isEdit ? "EDIT" : "ADD"} EXPENSE
      </Typography>
      <DialogContent className={styles.fields}>
        <Stack direction="row" spacing={2} className={styles.receiptImage}>
          {isEdit && !formFields.fileName && (
            <Avatar
              alt="receipt image"
              src={formFields.imageUrl}
              sx={{ marginRight: "1em" }}
            />
          )}
          <Button variant="outlined" component="label" color="secondary">
            Upload Receipt
            <input
              type="file"
              hidden
              onInput={(event) => {
                setFileData(event.target);
              }}
            />
          </Button>
          <Typography>{formFields.fileName}</Typography>
        </Stack>
        <Stack>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enGB}
          >
            <DatePicker
              label="Date"
              value={formFields.date}
              onChange={(newDate) => {
                setFormFields((prevState) => ({ ...prevState, date: newDate }));
              }}
              maxDate={new Date()}
              renderInput={(params) => (
                <TextField color="tertiary" {...params} />
              )}
            />
          </LocalizationProvider>
        </Stack>
        <TextField
          color="tertiary"
          label="Location name"
          variant="standard"
          value={formFields.locationName}
          onChange={(event) => updateFormField(event, "locationName")}
        />
        <TextField
          color="tertiary"
          label="Location address"
          variant="standard"
          value={formFields.address}
          onChange={(event) => updateFormField(event, "address")}
        />
        <TextField
          color="tertiary"
          label="Items"
          variant="standard"
          value={formFields.items}
          onChange={(event) => updateFormField(event, "items")}
        />
        <TextField
          color="tertiary"
          label="Amount"
          variant="standard"
          value={formFields.amount}
          onChange={(event) => updateFormField(event, "amount")}
        />
      </DialogContent>
      <DialogActions>
        {isSubmitting ? (
          <Button color="secondary" variant="contained" disabled={true}>
            Submitting...
          </Button>
        ) : (
          <Button
            color="secondary"
            variant="contained"
            disabled={isDisabled()}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

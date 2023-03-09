import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";

import styles from "../styles/dashboard.module.scss";

import AddIcon from "@mui/icons-material/Add";
import NavBar from "./NavBar";
import ExpenseDialog from "./ExpenseDialog";

import { useAuth } from "../firebase/auth";

const ADD_SUCCESS = "Receipt was successfully added!";
const ADD_ERROR = "Receipt was not successfully added!";
const EDIT_SUCCESS = "Receipt was successfully updated!";
const EDIT_ERROR = "Receipt was not successfully updated!";
const DELETE_SUCCESS = "Receipt successfully deleted!";
const DELETE_ERROR = "Receipt not successfully deleted!";

// Enum to represent different states of receipts
export const RECEIPTS_ENUM = Object.freeze({
  none: 0,
  add: 1,
  edit: 2,
  delete: 3,
});

const SUCCESS_MAP = {
  [RECEIPTS_ENUM.add]: ADD_SUCCESS,
  [RECEIPTS_ENUM.edit]: EDIT_SUCCESS,
  [RECEIPTS_ENUM.delete]: DELETE_SUCCESS,
};

const ERROR_MAP = {
  [RECEIPTS_ENUM.add]: ADD_ERROR,
  [RECEIPTS_ENUM.edit]: EDIT_ERROR,
  [RECEIPTS_ENUM.delete]: DELETE_ERROR,
};

export default function Dashboard() {
  const { authUser, isLoading } = useAuth();
  const [action, setAction] = useState(RECEIPTS_ENUM.none);

  const navigate = useNavigate();

  // State involved in loading, setting, deleting, and updating receipts
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
  const [deleteReceiptId, setDeleteReceiptId] = useState("");
  const [deleteReceiptImageBucket, setDeleteReceiptImageBucket] = useState("");
  const [updateReceipt, setUpdateReceipt] = useState({});

  // State involved in snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setErrorSnackbar] = useState(false);

  // Sets appropriate snackbar message on whether @isSuccess and updates shown receipts if necessary
  const onResult = async (receiptEnum, isSuccess) => {
    setSnackbarMessage(
      isSuccess ? SUCCESS_MAP[receiptEnum] : ERROR_MAP[receiptEnum]
    );
    isSuccess ? setSuccessSnackbar(true) : setErrorSnackbar(true);
    setAction(RECEIPTS_ENUM.none);
  };

  // Listen to changes for loading and authUser, redirect if needed
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/");
    }
  }, [authUser, isLoading]);

  // For all of the onClick functions, update the action and fields for updating

  const onClickAdd = () => {
    setAction(RECEIPTS_ENUM.add);
    setUpdateReceipt({});
  };

  const onUpdate = (receipt) => {
    setAction(RECEIPTS_ENUM.edit);
    setUpdateReceipt(receipt);
  };

  const onClickDelete = (id, imageBucket) => {
    setAction(RECEIPTS_ENUM.delete);
    setDeleteReceiptId(id);
    setDeleteReceiptImageBucket(imageBucket);
  };

  const resetDelete = () => {
    setAction(RECEIPTS_ENUM.none);
    setDeleteReceiptId("");
  };

  return !authUser ? (
    <CircularProgress
      color="inherit"
      sx={{ marginLeft: "50%", marginTop: "25%" }}
    />
  ) : (
    <div>
      <NavBar />
      <Container>
        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={1500}
          onClose={() => setSuccessSnackbar(false)}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert onClose={() => setSuccessSnackbar(false)} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showErrorSnackbar}
          autoHideDuration={1500}
          onClose={() => setErrorSnackbar(false)}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert onClose={() => setErrorSnackbar(false)} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Stack direction="row" sx={{ paddingTop: "1.5em" }}>
          <Typography
            variant="h4"
            sx={{ lineHeight: 2, paddingRight: "0.5em" }}
          >
            EXPENSES
          </Typography>
          <IconButton
            aria-label="edit"
            color="secondary"
            onClick={onClickAdd}
            className={styles.addButton}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Container>
      <ExpenseDialog
        edit={updateReceipt}
        showDialog={
          action === RECEIPTS_ENUM.add || action === RECEIPTS_ENUM.edit
        }
        onError={(receiptEnum) => onResult(receiptEnum, false)}
        onSuccess={(receiptEnum) => onResult(receiptEnum, true)}
        onCloseDialog={() => setAction(RECEIPTS_ENUM.none)}
      ></ExpenseDialog>
      <Dialog open={action === RECEIPTS_ENUM.delete} onClose={resetDelete}>
        <Typography variant="h4" className={styles.title}>
          DELETE EXPENSE
        </Typography>
        <DialogContent>
          <Alert severity="error">
            This will permanently delete your receipt!
          </Alert>
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px 24px" }}>
          <Button color="secondary" variant="outlined" onClick={resetDelete}>
            Cancel
          </Button>
          <Button color="secondary" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

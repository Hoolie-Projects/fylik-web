import { Dispatch, createStore } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    'limits'
  ]
}

export interface StoreState {
  language: 'en' | 'ru',
  notification: Notification | null,
  fileUploadingProgress: FileUploadingProgress,
  limits: Limits | null,
  uploadedFilesInfo: UploadedFilesInfo
}

export interface StoreDispatch {
  setLanguage(newLanguage: 'en' | 'ru'): void,
  setNotification(notification: Notification | null): void,
  setFileUploadingProgress(notification: FileUploadingProgress): void,
  setLimits(limits: Limits): void,
  setUploadedFilesInfo(uploadedFilesInfo: UploadedFilesInfo): void,
}

export interface StoreDispatchAction {
  type: string,
  payload: any
}

export interface Notification {
  title: string,
  contents?: string
}

export interface FileUploadingProgress {
  active: boolean,
  progress: number
}

export interface Limits {
  maxFileSize: number,
  maxFilesPerClient: number
}

export interface UploadedFilesInfo {
  fileIds: string[]
}

export const mapStateToProps = (state: StoreState): { store: StoreState } => ({ store: state });
export const mapDispatchToProps = (dispatch: Dispatch): { dispatcher: StoreDispatch } => ({
  dispatcher: {
    setLanguage: (newLanguage) => dispatch({ payload: newLanguage, type: "SET_LANGUAGE" }),
    setNotification: (notification) => dispatch({ payload: notification, type: "SET_NOTIFICATION" }),
    setFileUploadingProgress: (fileUploadingProgress) => dispatch({ payload: fileUploadingProgress, type: "SET_FILE_UPLOADING_PROGRESS" }),
    setLimits: (limits) => dispatch({ payload: limits, type: "SET_LIMITS" }),
    setUploadedFilesInfo: (uploadedFilesInfo) => dispatch({ payload: uploadedFilesInfo, type: "SET_UPLOADED_FILES_INFO" }),
  }
});

const initialState: StoreState = {
  language: 'ru',
  fileUploadingProgress: {
    active: false,
    progress: 0
  },
  notification: null,
  limits: null,
  uploadedFilesInfo: {
    fileIds: []
  }
}

function rootReducer(state = initialState, action: StoreDispatchAction) {

  // Set new amount
  if (action.type === "SET_LANGUAGE") {
    state.language = action.payload;
    return {
      ...state,
      amount: action.payload
    };
  }

  // Set notification
  if (action.type === "SET_NOTIFICATION") {
    state.notification = action.payload;
    return {
      ...state,
      notification: action.payload
    };
  }

  // Set file uploading progress
  if (action.type === "SET_FILE_UPLOADING_PROGRESS") {
    state.fileUploadingProgress = action.payload;
    return {
      ...state,
      fileUploadingProgress: action.payload
    };
  }

  // Set limits
  if (action.type === "SET_LIMITS") {
    state.limits = action.payload;
    return {
      ...state,
      limits: action.payload
    };
  }

  // Set uploaded files info
  if (action.type === "SET_UPLOADED_FILES_INFO") {
    state.uploadedFilesInfo = action.payload;
    return {
      ...state,
      uploadedFilesInfo: action.payload
    };
  }

  return state;
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer)
export const persistor = persistStore(store as any)

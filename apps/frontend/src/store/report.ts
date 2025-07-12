import { CreateReportDto, RequestState } from "@shared/types";
import { create } from "zustand"
import { reportApi } from "./apis/report";

interface ReportStore {
  requestState: RequestState;
}

const initialState: ReportStore = {
  requestState: "done"
}

const store = create(() => initialState);

const setRequestState = (requestState: RequestState) => {
  store.setState(() => ({ requestState }))
}

const createReport = async (data: CreateReportDto) => {
  try {
    setRequestState("loading");
    await reportApi.create(data);
    setRequestState("done");
  } catch {
    setRequestState("error");
  }
}

export const reportStore = {
  store,
  createReport
}